import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";

import { Consola } from "consola";
import { GraphQLResolveInfo } from "graphql";
import { UploadedFile } from "express-fileupload";
import getFieldNames from 'graphql-list-fields';
import { last } from "lodash";
import waitOn from "wait-on";

const awaitableDatabases: string[] = [
	'mysql',
	'postgres'
];

/**
 * Throw the given error. Useful in combination with
 * the nullish coalescing operator.
 * 
 * @param type The error type
 */
export function elseThrow(err: Error): never {
	throw err;
}

/**
 * Returns whether the current environment is
 * running in production mode.
 * 
 * @returns True if production
 */
export function isProduction(): boolean {
	return process.env.NODE_ENV == 'production';
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
 * Await a connection to the database or exit with a user error
 * 
 * @param logger The logger instance
 * @param options Database options
 */
export async function pollDatabase(logger: Consola, options: {driver: string, hostname: string, port: number}) {
	if(awaitableDatabases.includes(options.driver)) {
		const connection = `${options.hostname}:${options.port}`;

		try {
			await waitOn({
				timeout: 10_000,
				resources: [
					`tcp:${connection}`
				]
			});
		} catch(er) {
			logger.error(`Failed to connect to database ${connection}`);
			process.exit(0);
		}
	}
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
 * Returns a string containing the md5 file name, as well as the md5 bucket it will go in.
 * ex. "/c4/c4..."
 * @param file The file in question
 */
export function bucketPath(file: UploadedFile): string {
	const md5 = file.md5;

	const bucket = md5.substr(0, 2);
	const extension = last(file.name.split(/\./g));
	const fileName = `${md5}.${extension}`;

	return join(bucket, fileName);
}

/**
 * 
 * @param location The location on the server to save the file
 * @param file The file in question
 * @returns the full path of the saved file
 */
export async function saveToBucket(location: string, file: UploadedFile): Promise<string> {
	const bucketLocation = bucketPath(file);
	const fileLocation = join(location, bucketLocation);

	if(!existsSync(dirname(fileLocation))) {
		mkdirSync(dirname(fileLocation), { recursive: true });
	}

	await file.mv(fileLocation);

	return fileLocation;
}