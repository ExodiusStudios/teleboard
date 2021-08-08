import { IncomingMessage, createServer } from "http";
import { buildSchema, getAddress } from "./util/http";
import { database, logger } from ".";
import express, { Request, Response } from "express";

import { ApiError } from "./util/errors";
import { GraphQLError } from "graphql";
import { IPrisma } from "@quixo3/prisma-session-store/dist/@types";
import { IResolvers } from "graphql-tools";
import { IServerConfig } from "./util/config";
import { Nullable } from "./typings/types";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Server } from "http";
import UploadAvatarController from "./routes/upload/avatar";
import { User } from '@prisma/client';
import WebSocket from 'ws';
import cors from "cors";
import depthLimit from "graphql-depth-limit";
import { existsSync } from "fs";
import fileUpload from "express-fileupload";
import { graphqlHTTP } from "express-graphql";
import helmet from "helmet";
import { isProduction } from "./util/helpers";
import path from "path";
import session from 'express-session';
import { useServer } from 'graphql-ws/lib/use/ws';
import ws from "ws";

/**
 * Used to enable type checking for resolver
 * declarations while including correct resolver context
 */
export type GraphQLResolvers<Source = void> = IResolvers<Source, ResolverContext>

/**
 * The service in charge of serving http requests
 */
export class HTTPService {

	public clients = new Map<WebSocket, IncomingMessage>();
	public express: express.Application;
	
	private server: Server;
	private config: IServerConfig;
	private providers: ISchemaProvider[] = [];

	public constructor(config: IServerConfig) {
		this.config = config;

		const app = express();

		this.express = app;
		this.server = createServer(app);
	}

	/**
	 * Start the HTTP Service and listen on the
	 * port specified in the config.
	 */
	public async start() {
		const app = this.express;
		const port = this.config.general.port;
		const secret = this.config.authentication.secret;
		const production = isProduction();

		if(production) {
			app.set('trust proxy', 1);
		}

		// Configure the session store
		const sessionStore = new PrismaSessionStore(database as unknown as IPrisma, {
			checkPeriod: 2 * 60 * 1000,
			dbRecordIdIsSessionId: true
		});

		// Apply security middleware
		if(this.config.general.secure) {
			app.use(cors());
			app.use(helmet());
		}

		// Apply session management
		app.use(session({
			name: 'session',
			secret: secret,
			resave: false,
			store: sessionStore,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: production,
				sameSite: production
			}
		}));

		// Hook in core endpoints
		this.registerApi();
		this.registerStatic();
		this.registerUploads();

		this.server.listen(port, () => {
			logger.success('Vindigo Server running on port ' + port);
		});

		if(!this.server.listening) {
			logger.error('Failed to bind to port');
		}
	}

	/**
	 * Terminate the HTTP Service and unbind the port
	 */
	public stop() {
		logger.info('Stopping HTTP Service');
		this.server.close();
	}

	/**
	 * Returns the amount of connected clients
	 */
	public get clientAmount(): number {
		return this.clients.size;
	}

	/**
	 * Define a new schema provider to insert further
	 * types and fields into the GraphQL schema.
	 * 
	 * @param provider The provider
	 */
	public defineProvider(provider: ISchemaProvider) {
		logger.debug(`Defining ${provider.id} schema`);
		this.providers.push(provider);
	}

	/**
	 * Fetch the users profile
	 * 
	 * @param userId User id
	 * @returns Profile promise
	 */
	private fetchProfile(userId: number): Promise<Nullable<User>> {
		return database.user.findUnique({
			where: {
				id: userId
			}
		});
	}

	/**
	 * Register the API related routes on the HTTP server
	 * 
	 * @param http The HTTP server
	 * @param app The express app
	 * @param providers The availavble schema providers
	 */
	private registerApi() {
		const graphqlWs = new ws.Server({ server: this.server, path: '/subscriptions' });
		const schema = buildSchema(this.providers);

		// Configure a plain HTTP endpoint for handling
		// simple non-subscription GraphQL requests.
		this.express.use('/graphql', async (req, res) => {
			const context: ResolverContext = { req, res, user: null };

			if(req.session.userId) {
				context.user = await this.fetchProfile(req.session.userId);
			}

			graphqlHTTP({
				schema: schema,
				context: context,
				validationRules: [
					depthLimit(4)
				],
				customFormatErrorFn: (err: GraphQLError) => {
					if (err.originalError instanceof ApiError) {
						return { ...err, code: err.originalError.code };
					} else {
						return { ...err };
					}
				}
			})(req, res);
		});

		// Configure graphql-ws to provide means of executing
		// GraphQL requests over web sockets, allowing subscription
		// streaming to work.
		useServer<ResolverContext>({
			schema,
			onConnect: async (context) => {
				const request = context.extra.request as Request;
				const socket = context.extra.socket;
				const address = getAddress(request);

				if(request.session.userId) {
					context.extra.user = await this.fetchProfile(request.session.userId);
				}

				this.clients.set(socket, request);

				logger.info(`Client connection opened (${address} ${this.clientAmount})`);
			},
			onDisconnect: async (context) => {
				const socket = context.extra.socket;

				if (this.clients.delete(socket)) {
					const request = this.clients.get(socket);
					const address = request ? getAddress(request) : 'unknown';

					logger.info(`Client lost connection (${address} ${this.clientAmount})`);
				}
			}
		}, graphqlWs);
	}

	/**
	 * Register the static file server in charge of
	 * serving the vindigo client.
	 */
	private registerStatic() {
		const clientPath = path.join(__dirname, '../../vindigo-client/dist');
		const publicPath = path.join(__dirname, '../../../data/public');
		const indexPath = path.join(clientPath, 'index.html');

		// Exit the server if the client distribution
		// files have not yet been compiled.
		if(!existsSync(indexPath)) {
			logger.error('Failed to locate client distribution files. Make sure vindigo-client has been built before starting the server.');
			process.exit(0);
		}

		// Load public resources
		this.express.use('/data', express.static(publicPath));

		// Load any static resources
		this.express.use(express.static(clientPath));

		// Handle remaining routes in client
		this.express.get('*', (_, res) => {
			res.sendFile(indexPath);
		});
	}

	/**
	 * Register the file upload endpoints
	 */
	private registerUploads() {
		const uploader = fileUpload({
			abortOnLimit: true,
			limits: {
				fileSize: 5 * 1024 * 1024
			}
		});

		this.express.post('/upload/avatar', uploader, new UploadAvatarController().build());
	}
}

/**
 * A provider of a GraphQL Schema together with
 * implementation resolvers.
 */
export interface ISchemaProvider {

	/**
	 * The unique identification of this schema
	 */
	id: string;

	/**
	 * The schema associated with this module, if present
	 */
	schema: string;

	/**
	 * The associated graphql schema resolvers, if present
	 */
	resolvers: GraphQLResolvers<any>;

}

/**
 * The context instance passed to resolvers
 */
export interface ResolverContext extends Record<PropertyKey, any> {
	req: Request;
	res: Response;
	user: User|null;
}