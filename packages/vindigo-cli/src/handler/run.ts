import { ENTRYPOINT, assertConfigExists, assertInWorkingDirectory, assertServerDist } from "../util";

import { checkForUpdates } from "../util/updater";
import consola from "consola";

export async function handleRun() {
	assertInWorkingDirectory();
	assertConfigExists();
	assertServerDist();

	await checkForUpdates();
    
	consola.info('Starting Vindigo as foreground process...');

	try {
		process.env.VINDIGO_CLI = 'true';
		require(ENTRYPOINT);
	} catch(err) {
		consola.error('Failed to start Vindigo server', err);
	}
}