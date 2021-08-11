<template>
	<section class="project-page flex h-screen">
		<sidebar class="bg-accent-4" />
		<section class="flex flex-col flex-grow">
			<toolbar class="project-toolbar pl-0">
				<w-menu
					custom
					align-left
					hide-on-menu-click
				>
					<template #activator="{ on }">
						<w-button
							v-wave
							class="mx-3 text-gray-700"
							icon="mdi mdi-chevron-down"
							xl
							v-on="on"
						/>
					</template>
					<div class="list-menu">
						<p class="list-menu__title">
							{{ $t('PROJECT_OPTIONS') }}
						</p>
						<w-divider />
						<div class="list-menu__list">
							<div
								class="list-menu__item flex items-center"
								@click="settingsDialog = true"
							>
								<w-icon size="1.1rem">
									mdi mdi-cog-outline
								</w-icon>
								<div class="pl-1">
									<div>
										Settings
									</div>
									<small class="text-gray-400 -mt-1 block">
										Project management
									</small>
								</div>
							</div>
							<w-divider />
							<router-link
								to=""
								class="list-menu__item"
								tag="div"
							>
								<w-icon size="1.1rem">
									mdi mdi-lightning-bolt
								</w-icon>
								Automation
							</router-link>
							<router-link
								to=""
								class="list-menu__item"
								tag="div"
							>
								<w-icon size="1.1rem">
									mdi mdi-tag-text
								</w-icon>
								Labels & Tags
							</router-link>
							<router-link
								to=""
								class="list-menu__item"
								tag="div"
							>
								<w-icon size="1.1rem">
									mdi mdi-book
								</w-icon>
								Archive
							</router-link>
							<router-link
								to=""
								class="list-menu__item"
								tag="div"
							>
								<w-icon size="1.1rem">
									mdi mdi-bell
								</w-icon>
								Notifications
							</router-link>
							<w-divider />
							<div class="px-4 pb-1 text-dark-3 font-semibold flex items-center">
								Members
								<spacer />
								<small class="text-gray-500 font-medium underline cursor-pointer">
									Manage
								</small>
							</div>
							<div class="px-3 pb-2 flex flex-wrap">
								<avatar
									v-for="{ member } in project.members"
									:key="member.id"
									class="-mr-2 block"
									:profile="member"
									:size="30"
								/>
							</div>
							<div v-if="project.teams.length > 0" class="px-4 pb-1 text-dark-3 font-semibold flex items-center">
								Teams
								<spacer />
								<small class="text-gray-500 font-medium underline cursor-pointer">
									Manage
								</small>
							</div>
							<div class="px-3 pb-2 flex flex-wrap">
								<team-icon
									v-for="{ team } in project.teams"
									:key="team.id"
									class="mr-1 block"
									:team="team"
									:size="30"
								/>
							</div>
						</div>
					</div>
				</w-menu>

				<div class="flex flex-col">
					<h1 class="font-bold">
						{{ project.name }}
						<i class="mdi mdi-star" />
					</h1>
					<small class="font-thin -mt-1">
						{{ $t($route.meta.name) }}
					</small>
				</div>

				<template #creation-list>
					<div
						class="list-menu__item"
					>
						<w-icon size="1.1rem">
							mdi mdi-text-box-check
						</w-icon>
						{{ $t('TOOLBAR_CREATE_TASK') }}
						<p class="text-gray-400">
							{{ $t('TOOLBAR_CREATE_TASK_DESC') }}
						</p>
					</div>
				</template>
			</toolbar>
			<main role="main" class="flex-grow">
				<transition>
					<keep-alive>
						<router-view :project="project" />
					</keep-alive>
				</transition>
			</main>
		</section>

		<settings
			v-model="settingsDialog"
			:project="project"
		/>
	</section>
</template>

<script lang="ts">
import Sidebar from './Sidebar.vue';
import Vue from "vue";
import { parseSlug, updateTitle } from '../../util';
import { api } from '../..';
import gql from 'graphql-tag';
import Settings from './Settings.vue';
import { profileFragment, teamFragment } from '../../fragments';

async function fetchProjectData(id: number) {
	const res = await api.query(gql`
		query ($pid: Int!) {
			project(id: $pid) {
				id
				name
				readme
				accessLevel
				coverImage
				projectUrl
				members {
					member {
						...AllProfileFields
					}
				}
				teams {
					team {
						...AllTeamFields		
					}
				}
			}
		}
		${profileFragment}
		${teamFragment}
	`, { pid: id });

	return res.project;
}

export default Vue.extend({
	name: 'ProjectPage',

	components: {
		Sidebar,
		Settings
	},

	async beforeRouteEnter(to, _from, next) {
		const pid = parseSlug(to.params.project);

		if(pid == undefined) {
			next('/');
			return;
		}

		const project = await fetchProjectData(pid);

		next((vm: any) => {
			updateTitle(project.name);

			vm.project = project;
		});
	},

	data: () => ({
		project: {} as any,
		settingsDialog: false
	}),

	mounted() {
		if(!this.project.id) {
			this.$router.go(0);
		}
	},

	methods: {
		// NOTE Invoked from creation menu
		createTask() {

		}
	}
});
</script>

<style lang="postcss">
.project-toolbar .mdi-star {
	@apply text-yellow-400 ml-1;
	font-size: 1.1rem;
}

.app__header > .app__header_container {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.app__header > .app__header_container > .app__header_item_right {
	@apply flex;
}

</style>