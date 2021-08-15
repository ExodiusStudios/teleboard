import { IServerConfig, readConfig } from "vindigo-config";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

import { assertInWorkingDirectory } from "../util";
import { execSync } from "child_process";
import { resolve } from "path";
import { stripIndent } from 'common-tags';

const PRISMA_DIR = 'prisma';
const SCHEMA_FILE = 'prisma/schema.prisma';

export async function generatePrisma() {
	assertInWorkingDirectory();

	const config = readConfig();
	const details = generateDetails(config);

	// Generate prisma directory
	if(!existsSync(PRISMA_DIR)) {
		mkdirSync(PRISMA_DIR);
	}

	// Define schema list
	const schemas: string[] = [
		resolve(__dirname, '../../core.prisma')
	];

	// Generate the combined schema
	let fullSchema = generateBase(details);

	for(const schema of schemas) {
		fullSchema += `\n\n${readFileSync(schema, 'utf-8')}`;
	}

	writeFileSync(SCHEMA_FILE, fullSchema);

	// Generate the prisma client
	execSync('yarn prisma generate');
}

/**
 * Generate database connection details
 * 
 * @param param0 
 * @returns 
 */
function generateDetails({ database }: IServerConfig): ConnectionDetails {
	let connection: string;
	let provider: string;

	switch(database.driver) {
		case 'mysql': {
			connection = `mysql://${database.username}:${database.password}@${database.hostname}:${database.port}/${database.database}`;
			provider = 'mysql';
			break;
		}
		case 'postgres': {
			connection = `postgresql://${database.username}:${database.password}@${database.hostname}:${database.port}/${database.database}`;
			provider = 'postgresql';
			break;
		}
		case 'sqlite': {
			connection = `file:../${database.database}`;
			provider = 'sqlite';
			break;
		}
		default: {
			throw new Error('Unsupported driver');
		}
	}

	return { connection, provider };
}

/**
 * Generate the base schema containing the datasource and generator
 * 
 * @returns 
 */
function generateBase(details: ConnectionDetails): string {
	return stripIndent`
		datasource db {
			url      = "${details.connection}"
			provider = "${details.provider}"
		}
		
		generator client {
			provider = "prisma-client-js"
			previewFeatures = ["referentialActions"]
		}
	`;
}

interface ConnectionDetails {
	connection: string
	provider: string
}