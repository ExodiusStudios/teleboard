import { ApiError, MissingSessionError, NoPermissionError } from '../../../util/errors';
import { GraphQLResolvers, ResolverContext } from '../../../http';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { config, database, logger } from '../../..';
import { fetchProfileByEmail, fetchProfileByIdentity } from '../fetchers/profile';
import { buildProfileUpdate, registerNewProfile } from '../../../util/profile';

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
		const allowSignUp = config.authentication.registrations;

		if(!allowSignUp) {
			throw new NoPermissionError('Registrations are not permitted');
		}
		
		const existing = await fetchProfileByEmail(details.email);

		if(existing) {
			throw new ApiError('email-exists');
		}

		const profile = await registerNewProfile(
			details.email,
			details.fullname,
			details.password,
			false
		);

		sessionSignIn(ctx, details.remember, profile);

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
	verifyAccount: async (_, { code }) => {
		const profiles = await database.user.updateMany({
			where: {
				verifyCode: code
			},
			data: {
				verifyCode: null,
				isVerified: true
			}
		});

		if(profiles.count > 0) {
			logger.info(`Verified user with code ${code}`);
		}

		return profiles.count > 0;
	},
	updateProfile: async (_, { details }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const update = buildProfileUpdate(details);

		return database.user.update({
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