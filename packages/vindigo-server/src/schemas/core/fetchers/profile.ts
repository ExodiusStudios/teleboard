import { Nullable } from "../../../typings/types";
import { User } from "@prisma/client";
import { database } from "../../..";

/**
 * Fetch a profile by its unique id
 * 
 * @param id The user id
 * @returns The user, or null
 */
export function fetchProfileById(id: number): Promise<Nullable<User>> {
	return database.user.findUnique({
		where: { id }
	});
}

/**
 * Fetch a profile either by username or email
 * 
 * @param identity The identity
 * @returns The user, or null
 */
export function fetchProfileByIdentity(identity: string): Promise<Nullable<User>> {
	return database.user.findFirst({
		where: {
			OR: [
				{ email: identity },
				{ username: identity }
			]
		}
	});
}

/**
 * Fetch a profile by their email address
 * 
 * @param email The email address
 * @returns The user, or null
 */
export function fetchProfileByEmail(email: string): Promise<Nullable<User>> {
	return database.user.findFirst({
		where: { email }
	});
}

/**
 * Fetch a profile by their username
 * 
 * @param username The username
 * @returns The user, or null
 */
export function fetchProfileByUsername(username: string): Promise<Nullable<User>> {
	return database.user.findFirst({
		where: { username }
	});
}

/**
 * Generate a username from a given email address
 * 
 * @param email The email address
 * @returns The username
 */
export function generateUsername(email: string): string {
	return email.replace(/([^@]*).*/, '$1').replace(/\./g, '_');
}