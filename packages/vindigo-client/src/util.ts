import { Dictionary, find, forEach, isObject } from "lodash";

import { Route } from "vue-router";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config.js';

// TODO Move everything to helpers.ts, maybe?

/**
 * Create a logger instance that prepends all messages
 * with the specified label.
 * 
 * @param label The label
 * @param debug Whether the logger is debug
 * @returns Logging function
 */
export function logger(label: string, debug = false): (...args: any[]) => void {
	return (...args: any) => {
		(debug ? console.debug : console.log)(`[${label}]`, ...args);
	};
}

/**
 * Parse the given string to a number, and simply
 * return any number passed in.
 * 
 * @param value The input
 * @returns The number
 */
export function cleanInt(value: string|number): number {
	if(typeof value == 'number') {
		return value;
	} else {
		return parseInt(value);
	}
}

/**
 * Update the title of the current window
 * 
 * @param value The current page name, or undefined to remove
 */
export function updateTitle(value?: string) {
	if(value) {
		document.title = 'Vindigo • ' + value;
	} else {
		document.title = 'Vindigo';
	}
}

/**
 * Resolve the given meta key from the route meta or
 * any of the parent routes.
 * 
 * @param route The route
 * @param key The key to search
 * @returns The value
 */
export function getRouteMeta(route: Route, key: string): any {
	const found = find(route.matched, (r) => {
		return r.meta[key] !== undefined;
	});
	
	return found?.meta?.[key];
}

/**
 * Build a Wave UI color theme based on the current tailwind theme
 * 
 * @returns Theme
 */
export function buildThemeConfig(): Dictionary<string> {
	const config = resolveConfig(tailwindConfig as any).theme.colors || {};
	const colors: any = {};

	forEach(config, (value, name) => {
		if(isObject(value)) {
			forEach(value, (color, shade) => {
				colors[`${name}-${shade}`] = color;
			});
		} else {
			colors[name] = value;
		}
	});

	return colors;
}

/**
 * Parse the given slug string into a numeric id.
 * 
 * Slugs follow the format of a hyphen separated string of
 * words, with the first segment being a number.
 * 
 * @param slug The slug string
 * @returns decoded id
 */
export function parseSlug(slug: string): number|undefined {
	return parseInt(slug.split('-')[0]) || undefined;
}