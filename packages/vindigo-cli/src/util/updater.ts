/* eslint-disable @typescript-eslint/no-var-requires */

import compare from 'semver-compare';
import consola from 'consola';
import fetch from 'node-fetch';
import { readConfig } from 'vindigo-config';
import { trimStart } from 'lodash';

const RELEASE_URL = 'https://api.github.com/repos/ExodiusStudios/vindigo/releases/latest';

/**
 * Returns the current version
 * 
 * @returns Version string
 */
export function getCurrentVersion(): string {
	return require('../../../../package.json').version || '0.0.0';
}

/**
 * Returns the latest available release
 * 
 * @returns Version string
 */
export async function getLatestVersion(): Promise<{version: string, github: string}> {
	const response = await fetch(RELEASE_URL);
	const release = await response.json();

	return {
		version: trimStart(release.tag_name, 'v'),
		github: release.html_url
	};
}

/**
 * Checks whether a new version is available.
 * 
 * @returns true when a new version is available.
 */
export async function checkForUpdates(): Promise<boolean> {
	const config = readConfig();

	// Disable version checking
	if(!config.general.check_version) return false;
	
	const current = getCurrentVersion();
	const latest = await getLatestVersion();
	const result = compare(current, latest.version);

	if(result < 0) {
		consola.warn('There is a new version available: ' + latest.github);
	}


	return true;
}