import { Prisma, User } from "@prisma/client";
import { hash } from "bcrypt";
import { config, database, logger, mailer } from "..";
import { fetchProfileByUsername } from "../schemas/core/fetchers/profile";
import { InvalidArgumentError } from "./errors";
import { generateCode } from "./helpers";

/**
 * Generate a username from a given email address
 * 
 * @param email The email address
 * @returns The username
 */
export function generateUsername(email: string): string {
	return email.replace(/([^@]*).*/, '$1').replace(/\./g, '_');
}

/**
 * Register a new user account with the
 * supplied registration details.
 * 
 * @param details The registration details
 * @param verify Whether to verify the user
 * @returns The created user
 */
export async function registerNewProfile(
	email: string,
	fullname: string,
	password: string,
	verify: boolean
): Promise<User> {
	let username = '';
	let counter = 0;

	do {
		username = generateUsername(email) + (counter || '');
		counter++;
	} while(await fetchProfileByUsername(username));

	// Hash the provided password
	const passwordHash = await hash(password, 7);

	// Handle email verification
	const shouldVerify = config.authentication.verify_emails && !verify;
	const verifyCode = shouldVerify ? generateCode(12) : undefined;

	// Save the profile to the database
	const profile = await database.user.create({
		data: {
			username: username,
			name: fullname,
			email: email,
			password: passwordHash,
			role: 'guest',
			language: 'en-US',
			createdAt: new Date(),
			lastSeenAt: new Date(),
			isEnabled: true,
			isVerified: verify,
			verifyCode: verifyCode
		}
	});

	logger.info(`Registered new user ${username}`);

	if(shouldVerify) {
		mailer.sendTemplateEmail({
			template: 'email_confirmation',
			subject: 'Please verify your account',
			target: profile,
			context: {
				name: fullname,
				code: verifyCode!
			}
		}).catch(err => {
			logger.error('Failed to send verification email', err);
		});
	}

	return profile;
}

/**
 * Build a profile update query given the
 * specified profile details.
 * 
 * @param details Profile details
 * @returns The update query
 */
export function buildProfileUpdate(details: ProfileDetails): Prisma.UserUpdateInput {
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

	return update;
}

/**
 * Various information that can be updated
 * on a user profile.
 */
export interface ProfileDetails {
	fullname?: string;
	username?: string;
	website?: string;
	email?: string;
	bio?: string;
}