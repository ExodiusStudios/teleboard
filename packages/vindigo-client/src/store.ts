import { ActionTree, GetterTree, MutationTree, Store } from 'vuex';

import { RootState } from './store/state';
import { logger } from "./util";

/**
 * The service in charge of managing application
 * wide state.
 */
export class StoreService {

	public instance!: Store<RootState>;
	
	private logger = logger('Router');
	private modules: {[key: string]: StoreNamespace<any>} = {};
	private initialized = false;
	
	/**
	 * Define a new route in the application.
	 * 
	 * @param config The config
	 */
	public defineNamespace<T>(state: StoreNamespace<T>) {
		if(this.initialized) {
			throw new Error('State already configured');
		}

		if(this.modules[state.id]) {
			throw new Error(`State ${state.id} state already defined`);
		}

		this.modules[state.id] = state;		
		this.logger('Defined namespace ' + state.id);
	}

	/**
	 * Lock the current routing service from modifications and
	 * return the final VueRouter instance.
	 * 
	 * @returns The vue router
	 */
	public complete(): Store<RootState> {
		if(this.initialized) {
			throw new Error('Store already configured');
		}

		const core = this.modules['core'];
		
		if(!core) {
			throw new Error('Missing core namespace');
		}
		
		delete this.modules['core'];

		const store = new Store({
			...core,
			modules: this.modules
		});

		this.instance = store;
		this.initialized = true;

		return store;
	}

	/**
	 * Returns the store namespace of the given id
	 * 
	 * @param id The namespace id
	 * @returns The store namespace
	 */
	public get<S>(id: string): StoreNamespace<S> {
		const namespace = this.modules[id];

		if(!namespace) {
			throw new Error('Missing namespace ' + id);
		}

		return namespace;
	}

}

/**
 * Represents a namespaced section within the state store
 */
export interface StoreNamespace<S> {
	id: string,
	state: S | (() => S);
	getters?: GetterTree<S, S>;
	actions?: ActionTree<S, S>;
	mutations?: MutationTree<S>;
}