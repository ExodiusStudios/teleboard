import { merge } from 'lodash';
import { parse } from 'toml';
import { readFileSync } from 'fs';

let parsedConfig: IServerConfig|undefined;

/**
 * The Vindigo Server configuration
 */
export interface IServerConfig {
	general: {
		url: string,
		hostname: string,
		port: number,
		secure: boolean,
		maintenance: boolean,
		check_version: boolean,
		name: string,
		debug: boolean
	},
	authentication: {
		secret: string,
		anonymous_users: boolean,
		registrations: boolean
	},
	smtp: {
		enabled: boolean,
		domain: string,
		port: number,
		email: string,
		password: string,
		sender_name: string
		
	},
	database: {
		driver: string,
		hostname: string,
		username: string,
		password: string,
		database: string,
		port: number,
		path: string
	}
}

// The default config is used as fallback when
// the user config is missing fields.
const defaultConfig: IServerConfig = {
	general: {
		url: '',
		hostname: '127.0.0.1',
		port: 8085,
		secure: true,
		maintenance: false,
		check_version: true,
		name: 'Vindigo',
		debug: false
	},
	authentication: {
		secret: '',
		anonymous_users: false,
		registrations: false
	},
	smtp: {
		enabled: false,
		domain: '',
		port: 25,
		email: 'no-reply@example.com',
		password: '',
		sender_name: 'Vindigo'
	},
	database: {
		driver: 'mysql',
		hostname: '',
		username: '',
		password: '',
		database: 'vindigo',
		port: 3306,
		path: 'data/database.sqlite'
	}
};

/**
 * Validate a config and prevent serious issues
 * 
 * @param config The config
 * @returns The fixed config
 */
function validateConfig(config: IServerConfig): IServerConfig {
	if(!config.authentication.secret) {
		throw new Error('Auth secret must be specified');
	}

	return config;
}

/**
 * Read the server config into memory
 * 
 * @returns The config
 */
export function readConfig(): IServerConfig {
	if(parsedConfig) {
		return parsedConfig;
	}

	const config = parse(readFileSync('data/config.toml', 'utf-8'));
	const filled: IServerConfig = merge(defaultConfig, config);
	const validated = validateConfig(filled);

	parsedConfig = validated;
	return validated;
}