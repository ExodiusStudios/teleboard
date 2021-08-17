import { IServerConfig, readConfig } from 'vindigo-config';
import { assertConfigExists, assertInWorkingDirectory, getResource } from "../util";
import { isProduction, pollDatabase } from 'vindigo-config';
import knex, { Knex } from "knex";
import path, { basename } from "path";

import chalk from 'chalk';
import consola from "consola";
import { generatePrisma } from '../util/prisma';

export async function handleMigrateMake(args: any) {
	assertInWorkingDirectory();
	assertConfigExists();

	const config = readConfig();
	
	await withDatabase(config, async (db) => {
		const fullName = await db.migrate.make(args.name, {
			directory: path.join(__dirname, '../../src/migrations')
		});
		
		const fileName = basename(fullName);
	
		consola.success(chalk`Created new migration {cyanBright ${fileName}}`);
	});
}

export async function handleMigrateUp() {
	assertInWorkingDirectory();
	assertConfigExists();
    
	const config = readConfig();
	
	await withDatabase(config, async (db) => {
		const list = await db.migrate.list();

		if(list[1].length < 1) {
			await generatePrisma();
			consola.info('Migrations already up-to-date');
		} else {
			consola.info('Applying migrations...');
			const then = Date.now();

			await db.migrate.latest();
			await generatePrisma();

			const current = await getCurrent(db);
			const diff = Date.now() - then;

			consola.success(`Migrations executed (${diff}ms)`);
			consola.info(chalk`Now at {greenBright ${current}}`);
		}
	});
}

export async function handleMigrateDown(args: any) {
	assertInWorkingDirectory();
	assertConfigExists();
    
	const config = readConfig();
	
	await withDatabase(config, async (db) => {
		const list = await db.migrate.list();
		
		if(list[0].length < 1) {
			consola.info('Migrations already up-to-date');
		} else {
			if(args.all) {
				await db.migrate.rollback({}, true);

				consola.success('Rolled back all migration successfully');
			} else {
				await db.migrate.down();
				const current = await getCurrent(db);
				
				consola.success(chalk`Rolled back migration, now at {greenBright ${current}}`);
			}
		}

	});
}

export async function handleMigrateStatus() {
	assertInWorkingDirectory();
	assertConfigExists();

	const config = readConfig();
	
	await withDatabase(config, async (db) => {
		const current = await getCurrent(db);
		const list = await db.migrate.list();

		if(list[1].length < 1) {
			consola.info('Migrations already up-to-date');
		} else {
			consola.info(chalk`There are {cyanBright ${list[1].length}} pending migrations available`);
		}

		consola.info(chalk`Currently at: {greenBright ${current}}`);
	});
}

export async function handleMigrateGenerate() {
	const then = Date.now();

	consola.info('Generating database schema...');

	await generatePrisma();
	const diff = Date.now() - then;

	consola.success(`Generation complete (${diff}ms)`);
}

function buildConnection({ database }: IServerConfig): Knex.StaticConnectionConfig {
	return {
		host: database.hostname,
		user: database.username,
		password: database.password,
		database: database.database
	};
}

async function withDatabase(config: IServerConfig, callback: (db: Knex) => Promise<any>) {

	// Attempt to establish a connection to the database
	// and fail with a user error upon timeout.
	await pollDatabase(consola, config);
	
	const options: Knex.Config = {
		debug: !isProduction(),
		log: {
			warn: (msg) => {
				consola.warn(msg);
			},
			error: (msg) => {
				consola.error(msg);
			},
			debug: (msg) => {
				consola.debug(msg);
			},
			deprecate: (msg) => {
				consola.warn('deprecate: ' + msg);
			}
		},
		migrations: {
			tableName: 'migration',
			directory: path.join(__dirname, '../migrations'),
			stub: getResource('migration.stub.ts'),
			extension: 'ts'
		},
		useNullAsDefault: true
	};

	// Load the correct database details
	switch(config.database.driver) {
		case 'sqlite': {
			options.client = 'sqlite3';
			options.connection = {
				filename: config.database.database
			};
			break;
		}
		case 'postgres': {
			options.client = 'pg';
			options.connection = buildConnection(config);
			break;
		}
		case 'mysql': {
			options.client = 'mysql2';
			options.connection = buildConnection(config);
			break;
		}
		default: {
			throw new Error('Unknown database driver ' + config.database.driver);
		}
	}

	const db = knex(options);
	
	try {
		await callback(db);
	} finally {
		db.destroy();
	}
}

async function getCurrent(database: Knex) {
	const list = await database.migrate.list();
	const completed = list[0];

	if(completed.length < 1) return 'none';

	return completed[completed.length - 1];
}