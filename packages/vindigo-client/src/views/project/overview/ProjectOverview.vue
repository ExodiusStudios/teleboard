<template>
	<section ref="pageView" class="project-home-page">
		<div class="h-80 laptop:h-72 -mt-14 bg-light dark:bg-dark flex items-center">
			<div class="project-home-info">
				<div
					class="project-home-info__bar"
					:style="titleBarStyle"
				/>
				<div class="project-home-info__content">
					<h1 class="project-home-info__title">
						{{ project.name }}
					</h1>
					<div class="project-home-info__info-bar">
						<div v-for="item in infoBarItems" :key="item.name">
							<w-icon>
								{{ item.icon }}
							</w-icon>
							{{ item.value }}
							{{ $tc(item.name, item.value) }}
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<main class="container grid grid-cols-7 laptop:gap-16">
			<div class="col-span-full laptop:col-span-4 desktop:col-span-5 py-8">
				<section>
					<section-title icon="mdi mdi-text-box">
						{{ $t('PROJECT_OVERVIEW_SECTION_INFO') }}
					</section-title>
					<div class="project-readme markdown-enabled">
						<article
							v-if="project.readmeHtml"
							class="project-readme__content"
							v-html="project.readmeHtml"
						/>
						<div v-else class="project-readme__missing">
							<readme-graphic />
							<h2 class="text-xl font-medium text-gray-500 mt-4">
								No project information
							</h2>
							<p
								v-if="project.accessLevel == 'manager'"
								class="text-lg text-gray-400"
							>
								Enter project information in the project settings to provide additional information for project members.
							</p>
						</div>
					</div>
				</section>
			</div>
			<aside class="col-span-full laptop:col-span-3 desktop:col-span-2 order-first laptop:order-none -mt-20">
				<progress-view />
				<history-view class="pt-8" />
			</aside>
		</main>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import ProgressView from './Progress.vue';
import HistoryView from './History.vue';
import ReadmeGraphic from './ReadmeGraphic.vue';

export default Vue.extend({
	name: 'ProjectOverviewPage',
	
	components: {
		ProgressView,
		HistoryView,
		ReadmeGraphic
	},

	props: {
		project: {
			required: true,
			type: Object
		}
	},

	computed: {
		infoBarItems(): any[] {
			return [
				{ icon: 'mdi mdi-bookmark-check', name: 'GENERAL_TASK', value: 3 },
				{ icon: 'mdi mdi-account', name: 'GENERAL_MEMBER', value: 3 },
				{ icon: 'mdi mdi-account-group', name: 'GENERAL_TEAM', value: 3 }
			];
		},
		titleBarStyle(): any {
			return {
				backgroundColor: this.project.accentColor
			};
		}
	}
});
</script>

<style lang="postcss">
.project-home-info {
	@apply container flex;

	&__bar {
		@apply rounded-full;

		width: 5px;
	}

	&__content {
		@apply pl-4;
	}

	&__title {
		@apply text-3xl font-semibold pb-2 dark:text-white;
	}

	&__info-bar {
		@apply text-gray-500 flex gap-5;
	}
}

.project-readme {
	@apply bg-light shadow-xl flex flex-col rounded-3xl p-4 mt-2 dark:bg-dark-2;

	min-height: 250px;

	&__content {
		@apply rounded-3xl overflow-hidden;
	}

	&__missing {
		@apply text-center my-4;

		svg {
			@apply h-40 mx-auto;

			color: #14A7F4;
		}

		p {
			@apply mx-auto;

			max-width: 480px;
		}
	}
}
</style>