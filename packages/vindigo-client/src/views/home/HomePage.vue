<template>
	<section ref="pageView" class="home-page">
		<toolbar class="pl-0" />

		<div class="h-80 laptop:h-72 -mt-14 bg-white dark:bg-gray-800 flex items-center justify-center">
			<!-- Display just "Welcome" when user is signed out -->
			<avatar
				:size="80"
				:profile="$vuex.state.profile"
				:open-profile="false"
			/>
			<div class="pl-6 dark:text-gray-100">
				<h2 class="font-extrabold text-2xl">
					{{ $t('HOMEPAGE_WELCOME') }}
				</h2>
				<h1 class="font-extrabold text-2xl">
					{{ firstName }}
				</h1>
			</div>
		</div>
		
		<main class="container grid grid-cols-7 laptop:gap-16">
			<div class="col-span-full laptop:col-span-4 desktop:col-span-5 py-8">
				<!-- Starred projects -->
				<section v-if="starred.length > 0" class="your-projects mb-14">
					<section-title icon="mdi mdi-star">
						{{ $t('HOMEPAGE_SECTION_STARRED') }}
					</section-title>
					<project-list :projects="starred" :rows="1" />
				</section>

				<!-- Your projects -->
				<section class="your-projects mb-14">
					<section-title icon="mdi mdi-folder-open">
						{{ $t('HOMEPAGE_SECTION_PROJECTS') }}
					</section-title>
					<project-list :projects="projects" :rows="2">
						<template #empty>
							<div class="bg-white p-3">
								{{ $t('HOMEPAGE_NO_PROJECTS') }}
							</div>
						</template>
					</project-list>
				</section>
				
				<!-- Your teams -->
				<your-teams />
			</div>
			<aside class="col-span-full laptop:col-span-3 desktop:col-span-2 order-first laptop:order-none -mt-20">
				<activity-card />
				<focus-tasks class="pt-8" />
			</aside>
		</main>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import ActivityCard from './ActivityCard.vue';
import FocusTasks from './FocusTasks.vue';
import { Optional } from '../../typings/types';
import YourTeams from './YourTeams.vue';
import { api, store } from '../..';
import gql from 'graphql-tag';

function fetchPersonalProjects() {
	return api.query(gql`
		query {
			projects(mode: PERSONAL) {
				id
				name
				coverImage
				projectUrl
			}
		}
	`).then(res => res.projects);
}

export default Vue.extend({
	name: 'HomePage',
	
	components: {
		ActivityCard,
		FocusTasks,
		YourTeams
	},

	async beforeRouteEnter(_to, _from, next) {
		if(!store.instance.state.profile) {
			next('/explorer');
			return;
		}

		const [projects] = await Promise.all([
			fetchPersonalProjects()
		]);

		next((vm: any) => {
			vm.projects = projects;
			vm.starred = [];
		});
	},

	data: () => ({
		starred: [],
		projects: []
	}),

	computed: {
		firstName(): Optional<string> {
			return this.$vuex.state.profile?.firstName;
		}
	},

	methods: {
		getScrollView() {
			return this.$refs.pageView;
		}
	}
});
</script>

<style lang="postcss">
.home-page {
	@apply overflow-y-scroll h-screen;
}
</style>