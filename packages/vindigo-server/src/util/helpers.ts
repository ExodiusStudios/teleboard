import { GraphQLResolveInfo } from "graphql";
import getFieldNames from 'graphql-list-fields';
import { randomBytes } from 'crypto';
import { join } from "path";

export function elseThrow(err: Error): never {
	throw err;
}

/**
 * Resolve a path within the data directory
 * 
 * @param path The path to resolve
 * @returns The full path
 */
export function resolveData(...path: string[]) {
	return join('data', ...path);
}

/**
 * Compose a slug string given the unique id and display name. The slug is
 * used to encode a unique id and human readable name into a URL path.
 * 
 * @param info Slug information
 * @returns Slug string
 */
export function composeSlug(info: {id: number, name: string}): string {
	return [info.id, ...info.name.toLowerCase().split(' ')].join('-');
}

/**
 * Returns whether the current resolver has the given
 * field in its sub query.
 * 
 * @param info The resolver info
 * @param field The sub field
 * @returns Result
 */
export function hasField(info: GraphQLResolveInfo, field: string): boolean {
	return getFieldNames(info).some(f =>
		f == field || f.startsWith(field + '.')
	);
}

/**
 * Generate a securely random string of the given length
 * 
 * @param length String length
 * @returns The code
 */
export function generateCode(length: number): string {
	return randomBytes(length / 2).toString('hex');
}