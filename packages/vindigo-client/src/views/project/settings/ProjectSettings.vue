<template>
	<section class="project-settings">
		<div class="bg-light dark:bg-dark h-24" />
		<main class="mt-[-60px]" role="main">
			<section class="container container--thin">
				<w-tabs
					:items="settingTabs"
					:transition="false"
					:fill-bar="true"
					active-class="accent-1"
					slider-color="accent-1"
					class="overflow-visible"
				>
					<template #item-content="{ item }">
						<section class="mt-5 p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
							<component
								:is="item.content"
								:project="project"
							/>
						</section>
					</template>
				</w-tabs>
			</section>
		</main>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import GeneralTab from './tabs/GeneralTab.vue';

export default Vue.extend({
	name: 'ProjectSettings',

	props: ['project'],

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
	main {
		@apply pt-5;
	}

	.w-tabs {
		@apply border-none;

		&__content {
			@apply px-0;
		}

		&__content-wrap {
			@apply rounded-b-md;
		}
	}
}
</style>