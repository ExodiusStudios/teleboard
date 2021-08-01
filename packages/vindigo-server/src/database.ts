import { Connection, createConnection } from "typeorm";
import { isProduction, pollDatabase } from "./util/helpers";

import { IServerConfig } from "./util/config";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { logger } from ".";

/**
 * The service used to connect to the database
 */
export class DatabaseService {

	public connection: Connection;
	
	private config: IServerConfig;
	private models: Function[] = [];

	public constructor(config: IServerConfig) {
		this.config = config;
	}

	/**
	 * Start the Database Service and connect to
	 * the configured database.
	 */
	public async start() {

		// database config options
		const options = this.config.database;
		
		// Attempt a database connection
		await pollDatabase(logger, options);

		try {
			this.connection = await createConnection({
				type: options.driver as any,
				host: options.hostname,
				port: options.port,
				username: options.username,
				password: options.password,
				database: options.database,
				namingStrategy: new SnakeNamingStrategy(),
				entities: this.models,
				logging: !isProduction()
			});
		} catch (err) {
			logger.error('Error instantiating database connection: ' + err.message);
		}
	}

	/**
	 * Terminate the HTTP Service and unbind the port
	 */
	public stop() {
		logger.info('Stopping Database Service');
		this.connection.close();
	}
	
	/**
	 * Define a new schema provider to insert further
	 * types and fields into the GraphQL schema.
	 * 
	 * @param provider The provider
	 */
	public defineModel(model: Function) {
		logger.debug(`Defining ${model.name} model`);
		this.models.push(model);
	}

}