import { ENTRYPOINT, SCRIPT_NAME, assertConfigExists, assertInWorkingDirectory, assertServerDist } from "../util";
import pm2, { ProcessDescription, StartOptions } from 'pm2';

import chalk from "chalk";
import { checkForUpdates } from "../util/updater";
import consola from "consola";

export async function handleRestart() {
	assertInWorkingDirectory();
	assertConfigExists();
	assertServerDist();

	await checkForUpdates();
	
	pm2.connect((err: any) => {
		if(err) {
			consola.error('Could not connect to pm2: ', err);
			process.exit(0);
		}

		pm2.describe(SCRIPT_NAME, (_: any, proc: ProcessDescription[]) => {
			if(!proc.length || proc[0].pm2_env!.status != 'online') {
				consola.info('Vindigo is not currently running');
				process.exit(0);
			}

			consola.info('Restarting Vindigo daemon...');

			pm2.stop(ENTRYPOINT, (err: any) => {
				if(err) {
					consola.error('Could not stop process: ', err);
					process.exit(0);
				}
	
				pm2.start({
					script: ENTRYPOINT,
					name: SCRIPT_NAME,
					autorestart: false,
					env: {
						VINDIGO_CLI: 'true'
					}
				} as StartOptions, (err: any) => {
					if(err) {
						consola.error('Could not start process: ', err);
						process.exit(0);
					}
	
					consola.success('Successfully restarted Vindigo');
					consola.info(chalk`- Use {cyanBright vindigo status} to view process information`);
					consola.info(chalk`- Use {cyanBright vindigo stop} to terminate vindigo`);
					
					pm2.disconnect();
				});
			});
		});
	});
}