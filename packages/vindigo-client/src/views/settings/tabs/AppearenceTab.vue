<template>
	<div>
		<section class="setting">
			<div class="flex items-center mb-1">
				<w-switch
					v-model="darkMode"
				/>
				<label class="ml-4">
					{{ $t('SETTINGS_APPEARANCE_DARK_MODE') }}
				</label>
			</div>
			<small>
				Choose a theme that Vindigo will appear as to you
			</small>
		</section>
		<section class="setting">
			<label>
				{{ $t('SETTINGS_APPEARANCE_LANGUAGE') }}
			</label>
			<small>
				Change the interface language Vindigo uses.
			</small>
			<w-select
				v-model="language" 
				class="mt-2"
				item-label-key="name"
				item-value-key="id"
				:inner-icon-left="`flag-icon flag-icon-${languageFlag} lang-icon`"
				:bg-color="$isDark ? 'dark-3' : 'light-3'"
				:items="languages"
				color="gray-700"
			/>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import languages from '../../../registry/languages';
import { i18n } from '../../..';
import { Language } from '../../../i18n';
import { find } from 'lodash';

export default Vue.extend({
	name: 'AppearenceTab',
	data: () => ({
		languages: languages,
	}),
	computed: {
		darkMode: {
			get(): boolean {
				return this.$vuex.state.isDark;
			},
			set(value: boolean) {
				this.$vuex.commit('setDarkMode', value);
			}
		},
		languageFlag(): string {
			return find(this.languages, (lang: Language) => lang.id == this.language)?.icon || '';
		},
		language: {
			get(): string|undefined {
				return this.$vuex.state.language;
			},
			set(lang: string) {
				i18n.activate(lang);
			}
		}
	}
});
</script>