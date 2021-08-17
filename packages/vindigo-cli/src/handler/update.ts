import { ExecSyncOptions, execSync } from "child_process";

import { assertConfigExists, assertInWorkingDirectory } from "../util";
import chalk from "chalk";
import consola from "consola";
import { handleMigrateUp } from "./migrate";
import { buildClientAndServer } from "../util/builder";

export async function handleUpdate() {
	assertInWorkingDirectory();
	assertConfigExists();

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const version = require('../../../../package.json').version;
	const opts: ExecSyncOptions = {stdio: 'inherit'};
	const hasRestarted = process.env.VINDIGO_CLI_UPDATE == 'true';

	try {
		if(!hasRestarted) {
			consola.info('Preparing to run update scripts');
			consola.info('You are running Vindigo ' + chalk.cyan('v' + version));

			consola.info(chalk.magentaBright('Updating dependencies (1/5)'));
			console.log('');
			execSync('yarn install', opts);
			console.log('');

			consola.info(chalk.magentaBright('Building CLI distribution files (2/5)'));
			consola.info('Building...');
			execSync('yarn workspace vindigo-config build');
			execSync('yarn workspace vindigo-cli build');
			console.log('');

			consola.info(chalk.magentaBright('Restarting CLI... (3/5)'));
			console.log('');

			// Providing the VINDIGO_CLI_UPDATE variable will cause
			// the first part of this script to be skipped.
			execSync('node vindigo update', {
				env: { VINDIGO_CLI_UPDATE: 'true' },
				...opts
			});
		} else {
			consola.info(chalk.magentaBright('Applying pending migrations (4/5)'));
			await handleMigrateUp();
			console.log('');

			consola.info(chalk.magentaBright('Building distribution files (5/5)'));
			await buildClientAndServer();

			consola.success({
				message: 'Successfully executed update scripts',
				badge: true
			});
		}
	} catch(err) {
		consola.error('Exception thrown during update process', err);
	}
}