import { IServerConfig, readConfig } from 'vindigo-config';
import { assertConfigExists, assertInWorkingDirectory, getResource } from "../util";
import { isProduction, pollDatabase } from 'vindigo-server/dist/util/helpers';
import knex, { Knex } from "knex";
import path, { basename } from "path";

import chalk from 'chalk';
import consola from "consola";
import { generatePrisma } from '../util/prisma';

export async function handleMigrateMake(args: any) {
	assertInWorkingDirectory();
	assertConfigExists();

	const config = readConfig();
	const migrator = await initMigrator(config);
    
	const fullName = await migrator.make(args.name, {
		directory: path.join(__dirname, '../../src/migrations')
	});
	
	const fileName = basename(fullName);

	consola.success(chalk`Created new migration {cyanBright ${fileName}}`);
	process.exit(0);
}

export async function handleMigrateUp(args: any) {
	assertInWorkingDirectory();
	assertConfigExists();
    
	const config = readConfig();
	const migrator = await initMigrator(config);
	const list = await migrator.list();

	if(list[1].length < 1) {
		consola.info('Migrations already up-to-date');
	} else {
		consola.info('Applying migrations...');
		const then = Date.now();


		await migrator.latest();
		await generatePrisma();

		const current = await getCurrent(migrator);
		const diff = Date.now() - then;

		consola.success(`Migrations executed (${diff}ms)`);
		consola.info(chalk`Now at {greenBright ${current}}`);
	}

	process.exit(0);
}

export async function handleMigrateDown(args: any) {
	assertInWorkingDirectory();
	assertConfigExists();
    
	const config = readConfig();
	const migrator = await initMigrator(config);
	const list = await migrator.list();
	
	if(list[0].length < 1) {
		consola.info('Migrations already up-to-date');
	} else {
		if(args.all) {
			await migrator.rollback({}, true);

			consola.success('Rolled back all migration successfully');
		} else {
			await migrator.down();
			const current = await getCurrent(migrator);
			
			consola.success(chalk`Rolled back migration, now at {greenBright ${current}}`);
		}
	}

	process.exit(0);
}

export async function handleMigrateStatus() {
	assertInWorkingDirectory();
	assertConfigExists();

	const config = readConfig();
	const migrator = await initMigrator(config);
	const current = await getCurrent(migrator);
	const list = await migrator.list();

	if(list[1].length < 1) {
		consola.info('Migrations already up-to-date');
	} else {
		consola.info(chalk`There are {cyanBright ${list[1].length}} pending migrations available`);
	}

	consola.info(chalk`Currently at: {greenBright ${current}}`);
	process.exit(0);
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

async function initMigrator(config: IServerConfig): Promise<Knex.Migrator> {

	// Attempt to establish a connection to the database
	// and fail with a user error upon timeout.
	await pollDatabase(consola, config.database);
	
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

	return knex(options).migrate;
}

async function getCurrent(migrator: Knex.Migrator) {
	const list = await migrator.list();
	const completed = list[0];

	if(completed.length < 1) return 'none';

	return completed[completed.length - 1];
}