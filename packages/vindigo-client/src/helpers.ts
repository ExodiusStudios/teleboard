import VueRouter from "vue-router";
import { store } from ".";
import { TranslationKey } from "./typings/types";

export const MENU_DIVIDER = Symbol('menu-divider');

/**
 * Represents an item displayed in the
 * toolbar creation menu.
 */
export interface ToolbarCreationItem {
	icon: string,
	title: TranslationKey,
	description: TranslationKey,
	handler: Function|string
}

/**
 * Patch the router push function in order to globally
 * handle all failures gracefully. This patch will make
 * sure the loading bar is hidden on any error, and redirect
 * errors are hidden from console.
 */
export function patchRouterPush() {
	const original = VueRouter.prototype.push as any;
	const { isNavigationFailure, NavigationFailureType } = VueRouter;

	VueRouter.prototype.push = function(...args: any[]): any {
		let success: Function|null = null;
		let abort: Function|null = null;

		if(typeof args[1] == 'function') {
			success = args[1];
		}

		if(typeof args[2] == 'function') {
			abort = args[2];
		}

		return original.call(this, args[0]).then(() => {
			if(success) success();
		}).catch((err: Error) => {
			store.instance.commit('setWaiting', false);
			if(abort) abort(err);

			if(!isNavigationFailure(err, NavigationFailureType.redirected)) {
				throw err;
			}
		});
	};
}
