import { basename, dirname } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

import chalk from 'chalk';
import consola from 'consola';
import { getResource } from '../util';
import inquirer from 'inquirer';
import { randomBytes } from 'crypto';
import { handleMigrateGenerate, handleMigrateUp } from './migrate';
import { buildClientAndServer } from '../util/builder';

const DEFAULT_CONFIG = getResource('config.default.toml');
const ACTUAL_CONFIG = './data/config.toml';

export async function handleInit(args: any) {
	const shouldReset = !!args.force;

	if(!existsSync(DEFAULT_CONFIG)) {
		consola.error('Failed to locate default config');
		return;
	}

	if(!shouldReset && existsSync(ACTUAL_CONFIG)) {
		consola.info(chalk`This Vindigo installation is already configured`);
		consola.info(chalk`Use {cyanBright --force} to overwrite your existing config`);
		return;
	}

	const questions = [
		{
			name: 'URL',
			message: 'How will users access Vindigo?',
			type: 'input',
			default: 'http://localhost/'
		},
		{
			name: 'PORT',
			message: 'What port should Vindigo run on?',
			type: 'number',
			default: 8085
		},
		{
			name: 'NAME',
			message: 'How do you want to call your installation?',
			type: 'input',
			default: 'Vindigo'
		},
		{
			name: 'DB_DRIVER',
			message: 'Choose database driver',
			type: 'list',
			default: 'mysql',
			choices: [
				{ name: 'MySQL', value: 'mysql'},
				{ name: 'PostgreSQL', value: 'postgresql'},
				{ name: 'SQLite', value: 'sqlite'}
			]
		},
		{
			name: 'DB_HOSTNAME',
			message: 'Database hostname',
			type: 'input',
			default: '127.0.0.1',
			when: (q: any) => q.DB_DRIVER != 'sqlite'
		},
		{
			name: 'DB_PORT',
			message: 'Database port',
			type: 'number',
			default: (q: any) => q.DB_DRIVER == 'mysql' ? 3306 : 5432,
			when: (q: any) => q.DB_DRIVER != 'sqlite'
		},
		{
			name: 'DB_USERNAME',
			message: 'Database username',
			type: 'input',
			default: 'vindigo',
			when: (q: any) => q.DB_DRIVER != 'sqlite'
		},
		{
			name: 'DB_PASSWORD',
			message: 'Database password',
			type: 'input',
			default: '',
			when: (q: any) => q.DB_DRIVER != 'sqlite'
		},
		{
			name: 'DB_NAME',
			message: 'Database name',
			type: 'input',
			default: 'vindigo',
			when: (q: any) => q.DB_DRIVER != 'sqlite'
		},
		{
			name: 'DB_NAME',
			message: 'SQLite path',
			type: 'input',
			default: 'data/database.sqlite',
			when: (q: any) => q.DB_DRIVER == 'sqlite'
		}
	];

	let values: any = {};

	if(args.defaults) {
		// Skip the inquirer prompt and automatically pull
		// all default values from the questions.
		
		for(const question of questions) {
			if(question.default) {
				let value: any;

				if(question.when && !question.when(values)) continue;

				if(typeof question.default == 'function') {
					value = question.default(values);
				} else {
					value = question.default;
				}

				values[question.name] = value;
			}
		}
	} else {
		// Delagate prompting to inquirer
		
		consola.info('Welcome to the Vindigo setup utility!');
		consola.info(chalk`Answer the following questions to complete the setup`);

		values = await inquirer.prompt(questions);
	}

	values['GEN_DATE'] = new Date().toString();
	values['JWT_SECRET'] = randomBytes(32).toString('hex');
	
	const defaultConfig = readFileSync(DEFAULT_CONFIG, 'utf-8');
	const replacements: any = Object.fromEntries(Object.entries(values).map(([k, v]) => [`%${k}%`, v]));
	const finalConfig = defaultConfig.replace(/%\w+%/g, (match) => replacements[match] ?? ((match == '%DB_PORT%') ? '0' : ''));
	const parentDir = basename(dirname(ACTUAL_CONFIG));

	mkdirSync(parentDir, { recursive: true });
	writeFileSync(ACTUAL_CONFIG, finalConfig);

	const configPath = parentDir + '/config.toml';

	if(!args['skip-migrate']) {
		await handleMigrateUp();
	} else if(!args['skip-generate']) {
		await handleMigrateGenerate();
	}

	if(!args['skip-build']) {
		await buildClientAndServer();
	}

	consola.success(chalk`Successfully generated the configuration file ({yellow ${configPath}})`);
	consola.success(chalk`Use {cyanBright vindigo start} to start the Vindigo server`);
}