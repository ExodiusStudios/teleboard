import { handleMigrateDown, handleMigrateMake, handleMigrateStatus, handleMigrateUp } from './handler/migrate';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { handleInit } from './handler/init';
import { handleRestart } from './handler/restart';
import { handleRun } from './handler/run';
import { handleStart } from './handler/start';
import { handleStatus } from './handler/status';
import { handleStop } from './handler/stop';
import { handleUpdate } from './handler/update';
import { handleVersion } from './handler/version';
import relativeTime from 'dayjs/plugin/relativeTime';
import yargs from 'yargs';

dayjs.extend(duration);
dayjs.extend(relativeTime);

yargs
	.scriptName("vindigo")
	.usage('$0 <cmd> [options]')
	.command({
		command: 'start',
		describe: 'Launch the Vindigo server',
		handler: handleStart
	})
	.command({
		command: 'stop',
		describe: 'Terminate the Vindigo server',
		handler: handleStop
	})
	.command({
		command: 'restart',
		describe: 'Restart the Vindigo server',
		handler: handleRestart
	})
	.command({
		command: 'status',
		describe: 'Show the current daemon status',
		handler: handleStatus
	})
	.command({
		command: 'run',
		describe: 'Start the Vindigo server in the foreground',
		handler: handleRun
	})
	.command({
		command: 'init',
		describe: 'Configure your Vindigo installation',
		builder: () => yargs.option('force', {
			alias: 'F',
			describe: 'Allow overriding of the existing config'
		}).option('defaults', {
			alias: 'D',
			describe: 'Use default values without prompt'
		}),
		handler: handleInit
	})
	.command({
		command: 'check-version',
		describe: 'Query the latest version',
		handler: handleVersion
	})
	.command({
		command: 'update',
		describe: 'Perform update scripts',
		handler: handleUpdate
	})
	.command({
		command: 'migrate:make <name>',
		describe: 'Create a new migration',
		builder: () => yargs.positional('name', {
			describe: 'The migration name',
			demandOption: true
		}),
		handler: handleMigrateMake
	})
	.command({
		command: 'migrate:apply',
		describe: 'Apply the next pending migration',
		builder: () => yargs.option('all', {
			alias: 'A',
			describe: 'Apply all outstanding migrations'
		}),
		handler: handleMigrateUp
	})
	.command({
		command: 'migrate:rollback',
		describe: 'Rollback the previous migration',
		builder: () => yargs.option('all', {
			alias: 'A',
			describe: 'Rollback all previous migrations'
		}),
		handler: handleMigrateDown
	})
	.command({
		command: 'migrate:status',
		describe: 'Display migration information',
		handler: handleMigrateStatus
	})
	.help()
	.demandCommand()
	.strict()
	.parse();