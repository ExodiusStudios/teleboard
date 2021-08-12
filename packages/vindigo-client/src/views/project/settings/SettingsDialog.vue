<template>
	<w-dialog
		:value="value"
		dialog-class="project-settings"
		width="750"
		@input="$emit('input', $event)"
	>
		<div class="project-settings__title">
			<section-title icon="mdi mdi-cog">
				Project Settings
			</section-title>
		</div>

		<w-tabs
			:items="settingTabs"
			:fill-bar="true"
			active-class="accent-1"
			slider-color="accent-1"
			class="project-settings__tabs"
		>
			<template #item-content="{ item }">
				<div class="p-4">
					<component
						:is="item.content"
						:project="project"
					/>
				</div>
			</template>
		</w-tabs>
	</w-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import GeneralTab from './tabs/GeneralTab.vue';

export default Vue.extend({
	name: 'ProjectSettings',

	props: ['value', 'project'],

	computed: {
		settingTabs(): any[] {
			return [
				{ 
					title: this.$t('PROJECT_SETTINGS_TAB_GENERAL'), 
					content: GeneralTab 
				},
				{ 
					title: this.$t('PROJECT_SETTINGS_TAB_INFORMATION'), 
					content: GeneralTab 
				},
				{ 
					title: this.$t('PROJECT_SETTINGS_TAB_COVER'), 
					content: GeneralTab 
				},
				{ 
					title: this.$t('PROJECT_SETTINGS_TAB_MEMBERS'), 
					content: GeneralTab 
				},
				{ 
					title: this.$t('PROJECT_SETTINGS_TAB_TEAMS'), 
					content: GeneralTab 
				}
			];
		}
	},

	
});
</script>

<style lang="postcss">
.project-settings {
	@apply rounded-xl;

	&__title {
		@apply p-4;

		background-color: rgba(0, 0, 0, 0.04);
	}

	&__tabs {
		@apply border-0;

		.w-tabs__bar {
			background-color: rgba(0, 0, 0, 0.04);
		}

		.w-tabs__content {
			@apply p-0;
		}
	}

	> .w-card__content {
		@apply p-0;
	}
}
</style>