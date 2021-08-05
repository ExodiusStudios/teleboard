<template>
	<div>
		<section>
			<div class="flex items-center">
				<w-switch
					v-model="darkMode"
				/>
				<label class="ml-4">
					{{ $t('SETTINGS_APPEARANCE_DARK_MODE') }}
				</label>
				<spacer />
				<w-icon class="mr-2" style="margin-top: -2px">
					mdi mdi-information-outline
				</w-icon>
			</div>
			<small class="d-block mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur autem molestiae cum maxime perspiciatis voluptatibus consequuntur. Eaque corrupti ullam est rerum corporis dignissimos totam distinctio a fugit recusandae. Reiciendis, facere.</small>
		</section>
		<w-divider class="my-6 -mx-6" />
		<w-select
			v-model="language" 
			:items="languages"
			:inner-icon-left="`flag-icon flag-icon-${languageFlag} lang-icon`"
			item-label-key="name"
			item-value-key="id"
			:label="$t('SETTINGS_APPEARANCE_LANGUAGE')"
			class="language-picker"
		/>
		<small class="d-block mt-3">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, veritatis est quis libero at harum eum quod rem repellat vel dicta corrupti laboriosam obcaecati aperiam error aut iste porro officia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum labore ad reiciendis cum recusandae aut, repellendus amet. Impedit officiis nesciunt, consequatur eligendi et fugit! Voluptas corrupti consectetur perferendis quidem laboriosam.
		</small>
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