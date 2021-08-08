import { ApiError, MissingSessionError } from '../../../util/errors';
import { GraphQLResolvers, ResolverContext } from '../../../http';
import { Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { database, logger } from '../../..';
import { fetchProfileByEmail, fetchProfileByIdentity, fetchProfileByUsername, generateUsername } from '../fetchers/profile';

/**
 * Sign in the session 
 * 
 * @param ctx The context
 * @param remember Remember session
 * @param user The user details
 */
function sessionSignIn(ctx: ResolverContext, remember: boolean, user: User) {
	ctx.req.session.userId = user.id;

	if(remember) {
		ctx.req.session.cookie.maxAge = 2628000000;
	}
}

export default {
	register: async (_, { details }, ctx) => {
		const existing = await fetchProfileByEmail(details.email);

		if(existing) {
			throw new ApiError('email-exists');
		}

		// Generate a unique username
		let username = '';
		let counter = 0;

		do {
			username = generateUsername(details.email) + (counter || '');
			counter++;
		} while(await fetchProfileByUsername(username));

		// Hash the provided password
		const password = await hash(details.password, 7);

		// Save the profile to the database
		const profile = await database.user.create({
			data: {
				username: username,
				name: details.fullname,
				email: details.email,
				password: password,
				role: 'guest',
				language: 'en-US',
				createdAt: new Date(),
				lastSeenAt: new Date(),
				isEnabled: true,
				isVerified: false
			}
		});

		sessionSignIn(ctx, details.remember, profile);
		logger.info(`Registered new user ${details.username}`);
		return profile;
	},
	authenticate: async (_, { details }, ctx) => {
		if(!details.identity || !details.password) {
			throw new ApiError('invalid-request');
		}

		logger.debug(`Authenticating ${details.identity}`);
		
		// Find the user profile
		const user = await fetchProfileByIdentity(details.identity);

		if(!user) {
			logger.debug(`Identity not found`);
			return;
		}

		// Compare hashed passwords
		const valid = await compare(details.password, user.password);

		if(!valid) {
			logger.debug(`Password missmatch`);
			return;
		}

		sessionSignIn(ctx, details.remember, user);
		logger.info(`Authenticated ${user.username}`);
		return user;
	},
	updateProfile: async (_, { details }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const update: Prisma.UserUpdateInput = {};
		
		if(details.fullname) {
			update.name = details.fullname;
		}

		if(details.email) {
			update.email = details.email;
		}

		if(details.username) {
			update.username = details.username;
		}

		if(details.bio) {
			//update.bio = details.bio;
		}

		if(details.website) {
			//update.website = details.website;
		}

		await database.user.update({
			where: {
				id: ctx.user.id
			},
			data: update
		});
	},
	signOut: async (_, _args, ctx) => {
		return new Promise((resolve) => {
			ctx.req.session.destroy(resolve);
		});
	}
} as GraphQLResolvers;