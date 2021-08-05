<template>
	<section ref="pageView" class="home-page">
		<toolbar ref="toolbar" class="pl-0" />

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
				<starred-view
					v-if="starred.length > 0"
					:starred="Starred"
				/>

				<projects-view
					:projects="projects"
					@create="$refs.toolbar.openProjectCreation()"
				/>
				
				<teams-view
					v-if="teams.length"
					:teams="teams"
				/>
			</div>
			<aside class="col-span-full laptop:col-span-3 desktop:col-span-2 order-first laptop:order-none -mt-20">
				<activity-view />
				<focus-view class="pt-8" />
			</aside>
		</main>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import ActivityView from './Activity.vue';
import FocusView from './Focus.vue';
import TeamsView from './Teams.vue';
import ProjectsView from './Projects.vue';
import StarredView from './Starred.vue';
import { Optional } from '../../typings/types';
import { api, store } from '../..';
import gql from 'graphql-tag';
import { projectTileFragment } from '../../fragments';

export default Vue.extend({
	name: 'HomePage',
	
	components: {
		ActivityView,
		FocusView,
		TeamsView,
		ProjectsView,
		StarredView
	},

	async beforeRouteEnter(_to, _from, next) {
		if(!store.instance.state.profile) {
			next('/explorer');
			return;
		}

		const { projects, teams } = await api.query(gql`
			query {
				projects(mode: ACCESS) {
					...ProjectTileFields
				}
				teams {
					id
					name
					teamUrl
					logoImage
					projects {
						...ProjectTileFields
					}
				}
			}
			${projectTileFragment}
		`);

		next((vm: any) => {
			vm.projects = projects;
			vm.starred = [];
			vm.teams = teams.filter((team: any) => team.projects.length);
		});
	},

	data: () => ({
		starred: [],
		projects: [],
		teams: []
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