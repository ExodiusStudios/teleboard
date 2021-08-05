import { getCurrentVersion, getLatestVersion } from "../util/updater";

import chalk from "chalk";
import compare from 'semver-compare';
import consola from "consola";
import { readConfig } from "../../../vindigo-server/dist/util/config";

export async function handleVersion() {
	const config = readConfig();
	const current = getCurrentVersion();
	const latest = await getLatestVersion();

	const result = compare(current, latest.version);
	let versionChecking: string;

	if(config.general.check_version) {
		versionChecking = chalk.green('Enabled');
	} else {
		versionChecking = chalk.red('Disabled');
	}

	console.log();
	consola.info(chalk`Latest version: {cyanBright ${latest.version}}`);
	consola.info(chalk`Current version: {cyanBright ${current}}`);
	consola.info(`Version checking: ${versionChecking}`);

	if(result >= 0) {
		console.log();
		consola.success('Your Vindigo is up-to-date');
		console.log();
	} else {
		consola.warn('There is a new version available: ' + latest.github);
	}

	process.exit(0);
}