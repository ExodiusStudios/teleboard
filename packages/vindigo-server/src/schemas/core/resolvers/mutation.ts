import { ApiError, InvalidArgumentError, MissingSessionError, NoPermissionError } from '../../../util/errors';
import { GraphQLResolvers, ResolverContext } from '../../../http';
import { Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { config, database, logger, mailer } from '../../..';
import { fetchProfileByEmail, fetchProfileByIdentity, fetchProfileByUsername, generateUsername } from '../fetchers/profile';
import { generateCode } from '../../../util/helpers';

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

		// Generate a unique username
		let username = '';
		let counter = 0;

		do {
			username = generateUsername(details.email) + (counter || '');
			counter++;
		} while(await fetchProfileByUsername(username));

		// Hash the provided password
		const password = await hash(details.password, 7);

		// Generate a unique verification code
		const verifyCode = generateCode(12);

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
				isVerified: false,
				verifyCode: verifyCode
			}
		});

		sessionSignIn(ctx, details.remember, profile);

		logger.info(`Registered new user ${username}`);

		mailer.sendTemplateEmail({
			template: 'email_confirmation',
			subject: 'Please verify your account',
			target: profile,
			context: {
				name: details.fullname,
				code: verifyCode
			}
		}).catch(err => {
			logger.error('Failed to send verification email', err);
		});

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

		const update: Prisma.UserUpdateInput = {};
		
		if(details.fullname !== undefined) {
			if(!details.fullname.length) {
				throw new InvalidArgumentError('name cannot be empty');
			}
			
			update.name = details.fullname;
		}

		if(details.email !== undefined) {
			if(!details.email.length) {
				throw new InvalidArgumentError('email cannot be empty');
			}

			update.email = details.email;
		}

		if(details.username !== undefined) {
			if(!details.username.length) {
				throw new InvalidArgumentError('username cannot be empty');
			}
			
			// TODO Check for username existence

			update.username = details.username;
		}

		if(details.bio !== undefined) {
			update.bio = details.bio || null;
		}

		if(details.website !== undefined) {
			update.website = details.website || null;
		}

		return await database.user.update({
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