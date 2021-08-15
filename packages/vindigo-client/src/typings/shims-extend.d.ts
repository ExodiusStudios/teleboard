// eslint-disable-next-line unused-imports/no-unused-imports
import Vue from 'vue';
import { Store } from 'vuex';
import { ClientConfig } from '../model/config';
import { RootState } from '../store/state';

declare module 'vue/types/vue' {
	interface Vue {
		$vuex: Store<RootState>;
		$config: ClientConfig;
		$waveui: any;
	}
}

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {
		waveui?: any
	}
}