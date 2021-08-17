import { assertInWorkingDirectory } from "../util";

import { execSync } from "child_process";
import consola from "consola";

export async function buildClientAndServer() {
	assertInWorkingDirectory();

	// Client
	consola.info('Building client...');
	execSync('yarn workspace vindigo-client build', { stdio: 'ignore' });

	// Server
	consola.info('Building server...');
	execSync('yarn workspace vindigo-server build', { stdio: 'ignore' });
}