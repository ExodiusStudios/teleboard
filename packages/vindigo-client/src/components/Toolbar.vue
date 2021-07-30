<template>
	<header
		ref="toolbar"
		class="toolbar"
		:class="toolbarClass"
	>
		<w-progress
			top
			absolute
			size="0.275em"
			class="toolbar__waiter"
			color="blue"
			:value="progress"
			:class="waiterClass"
		/>

		<slot>
			<router-link to="/">
				<img
					:src="logoUrl"
					class="h-10 select-none"
					@dragstart.prevent
				>
			</router-link>
		</slot>

		<spacer />

		<!-- ANCHOR Search container -->
		<div class="toolbar__search">
			<div class="relative">
				<w-input
					v-model="search"
					class="rounded-lg overflow-hidden"
					inner-icon-left="mdi mdi-magnify"
					:placeholder="$t('TOOLBAR_SEARCH')"
					bg-color="gray-200"
					autocomplete="off"
					color="gray-700"
					name="search"
					@focus="isSearching = true"
					@blur="isSearching = false"
				/>
			</div>
		</div>
		
		<!-- ANCHOR Search results menu -->
		<w-menu
			:value="isSearching && search.length"
			content-class="search-panel"
			detach-to=".toolbar__search>.relative"
			min-width="100%"
		>
			<div v-if="search.length < 3">
				{{ $t('TOOLBAR_SEARCH_LENGTH') }}
			</div>
			<div v-else-if="searchResults.total == 0">
				{{ $t('TOOLBAR_SEARCH_NO_RESULTS') }}
			</div>
			<div v-else-if="!searchResults.present">
				{{ $t('TOOLBAR_SEARCH_SEARCHING') }}
			</div>
			<template v-else>
				<div v-if="searchResults.users.length > 0">
					<section-title icon="mdi mdi-folder-open">
						Users
					</section-title>
					<router-link
						v-for="(user, index) in searchResults.users"
						:key="index"
						:to="`/profile/${user.id}`"
						class="flex items-center mt-2"
						tag="dev"
					>
						<avatar
							:profile="user"
							:size="22"
							class="mr-3"
						/>
						{{ user.fullName }}
					</router-link>
				</div>
				<div v-if="searchResults.teams.length > 0">
					<section-title icon="mdi mdi-folder-open">
						Teams
					</section-title>
					<div 
						v-for="(team, index) in searchResults.teams" :key="index"
					>
						{{ team }}
					</div>
				</div>
				<div v-if="searchResults.projects.length > 0">
					<section-title icon="mdi mdi-folder-open">
						Projects
					</section-title>
					<div 
						v-for="(project, index) in searchResults.projects" :key="index"
					>
						{{ project.name }}
					</div>
				</div>
			</template>
		</w-menu>

		<!-- ANCHOR Create new button -->
		<w-menu
			hide-on-menu-click
			align-center
			custom
		>
			<template #activator="{on}">
				<w-button
					v-wave
					class="mr-0 text-indigo-600 dark:text-gray-100"
					icon="mdi mdi-plus-circle"
					to="#"
					xl
					v-on="on"
				/>
			</template>
			<div class="toolbar-menu">
				<p class="toolbar-menu__title">
					{{ $t('TOOLBAR_CREATE') }}
				</p>
				<w-divider />
				<div class="toolbar-menu__list">
					<template v-for="(item, i) in creationItems">
						<w-divider v-if="item == MENU_DIVIDER" :key="i" />
						<div
							v-else :key="i"
							class="toolbar-menu__item"
							@click="item.handler"
						>
							<w-icon size="1.1rem">
								{{ item.icon }}
							</w-icon>
							{{ $t(item.title) }}
							<p class="text-gray-400">
								{{ $t(item.description) }}
							</p>
						</div>
					</template>
				</div>
			</div>
		</w-menu>

		<!-- Notification button -->
		<w-button
			v-wave
			class="mr-3 text-gray-600 dark:text-gray-100"
			icon="mdi mdi-bell"
			to="#"
			xl
		/>

		<div class="toolbar__divider mr-4" />

		<!-- ANCHOR Account menu -->
		<w-menu
			align-right
			custom
		>
			<template #activator="{on}">
				<div
					class="flex items-center text-gray-800 cursor-pointer"
					v-on="on"
				>
					<h1 class="mb-0 font-semibold dark:text-gray-100">
						{{ userName }}
					</h1>
					<avatar
						class="ml-2"
						:profile="$vuex.state.profile"
						:open-profile="false"
					/>
				</div>
			</template>
			<div class="toolbar-menu">
				<p class="toolbar-menu__title">
					{{ $t('YOUR_ACCOUNT') }}
				</p>
				<w-divider />
				<div class="toolbar-menu__list">
					<router-link
						to="/profile/10"
						class="toolbar-menu__item"
						tag="div"
					>
						<w-icon size="1.1rem">
							mdi mdi-account
						</w-icon>
						{{ $t('YOUR_ACCOUNT_PROFILE') }}
					</router-link>
					<router-link
						to=""
						class="toolbar-menu__item"
						tag="div"
					>
						<w-icon size="1.1rem">
							mdi mdi-animation
						</w-icon>
						{{ $t('YOUR_ACCOUNT_PROJECTS') }}
					</router-link>
					<router-link
						to=""
						class="toolbar-menu__item"
						tag="div"
					>
						<w-icon size="1.1rem">
							mdi mdi-briefcase
						</w-icon>
						{{ $t('YOUR_ACCOUNT_TEAMS') }}
					</router-link>
					<router-link
						to=""
						class="toolbar-menu__item"
						tag="div"
					>
						<w-icon size="1.1rem">
							mdi mdi-google-analytics
						</w-icon>
						{{ $t('YOUR_ACCOUNT_ACTIVITY') }}
					</router-link>
					<w-divider />
					<router-link
						to=""
						class="toolbar-menu__item"
						tag="div"
					>
						<w-icon size="1.1rem">
							mdi mdi-help-circle-outline
						</w-icon>
						{{ $t('YOUR_ACCOUNT_HELP') }}
					</router-link>
					<router-link
						to="/settings"
						class="toolbar-menu__item"
						tag="div"
					>
						<w-icon size="1.1rem">
							mdi mdi-cog-outline
						</w-icon>
						{{ $t('YOUR_ACCOUNT_SETTINGS') }}
					</router-link>
					<w-divider />
					<div
						class="toolbar-menu__item text-red-400"
						@click="$store.dispatch('signOut')"
					>
						<w-icon size="1.1rem">
							mdi mdi-logout
						</w-icon>
						{{ $t('YOUR_ACCOUNT_SIGN_OUT') }}
					</div>
				</div>
			</div>
		</w-menu>

		<!-- ANCHOR Project creation dialog -->
		<w-dialog
			v-model="newProjectDialog"
			dialog-class="rounded-xl"
			width="600"
		>
			<section-title icon="mdi mdi-folder-multiple-plus">
				Create new project
			</section-title>
			
			<div class="p-2">
				<label class="text-gray-500 mb-1 mt-3 block text-sm">
					Project name
				</label>
				<w-input
					v-model="newProjectName"
					class="rounded-lg overflow-hidden"
					bg-color="gray-200"
					color="gray-700"
				/>

				<label class="text-gray-500 mb-1 mt-3 block text-sm">
					Description <small>(optional)</small>
				</label>
				<w-textarea
					v-model="newProjectDesc"
					class="rounded-lg overflow-hidden"
					bg-color="gray-200"
					color="gray-700"
					rows="3"
				/>

				<label class="text-gray-500 mb-1 mt-3 block text-sm">
					Invite members <small>(optional)</small>
				</label>

				<div class="addition-list">
					<!-- TODO Implement member addition -->
					<avatar
						v-for="i in tempMemberCount"
						:key="i"
						class="-mr-2 mb-1 block"
						:profile="$vuex.state.profile"
						:open-profile="false"
						:size="46"
					/>
					<div
						v-if="tempMemberCount < 12"
						class="addition-list"
						@click="tempMemberCount++"
					>
						<w-icon class="addition-list__add-btn">
							mdi mdi-plus
						</w-icon>
					</div>
				</div>

				<div class="flex mt-5">
					<spacer />
					<w-button
						v-wave
						color="white"
						bg-color="indigo-600"
						:loading="newProjectLoading"
						:disabled="!newProjectName"
						@click="createProject"
					>
						<w-icon class="mr-2">
							mdi mdi-plus
						</w-icon>
						Create project
					</w-button>
				</div>
			</div>
		</w-dialog>

		<!-- ANCHOR Project creation dialog -->
		<w-dialog
			v-model="newTeamDialog"
			dialog-class="rounded-xl"
			width="600"
		>
			<section-title icon="mdi mdi-account-multiple-plus">
				Create new team
			</section-title>
			
			<div class="p-2">
				<label class="text-gray-500 mb-1 mt-3 block text-sm">
					Team name
				</label>
				<w-input
					v-model="newTeamName"
					class="rounded-lg overflow-hidden"
					bg-color="gray-200"
					color="gray-700"
				/>

				<label class="text-gray-500 mb-1 mt-3 block text-sm">
					Description <small>(optional)</small>
				</label>
				<w-textarea
					v-model="newTeamDesc"
					class="rounded-lg overflow-hidden"
					bg-color="gray-200"
					color="gray-700"
					rows="3"
				/>

				<label class="text-gray-500 mb-1 mt-3 block text-sm">
					Invite members <small>(optional)</small>
				</label>

				<div class="addition-list">
					<!-- TODO Implement member addition -->
					<avatar
						v-for="i in tempMemberCount"
						:key="i"
						class="-mr-2 mb-1 block"
						:profile="$vuex.state.profile"
						:open-profile="false"
						:size="46"
					/>
					<div
						v-if="tempMemberCount < 12"
						class="addition-list"
						@click="tempMemberCount++"
					>
						<w-icon class="addition-list__add-btn">
							mdi mdi-plus
						</w-icon>
					</div>
				</div>

				<div class="flex mt-5">
					<spacer />
					<w-button
						v-wave
						color="white"
						bg-color="indigo-600"
						:loading="newTeamLoading"
						:disabled="!newTeamName"
						@click="createTeam"
					>
						<w-icon class="mr-2">
							mdi mdi-plus
						</w-icon>
						Create team
					</w-button>
				</div>
			</div>
		</w-dialog>
	</header>
</template>

<script lang="ts">
import Vue from "vue";
import { Optional } from "../typings/types";
import { Scrollable } from "../mixin/scrollable";
import { api } from "..";
import { gql } from "@apollo/client/core";
import { MENU_DIVIDER, ToolbarCreationItem } from '../helpers';
import { debounce, sum, values } from "lodash";
import { mapState } from "vuex";

interface SearchInterface {
	projects: object[];
	teams: object[];
	users: object[];
}

export default Vue.extend({
	name: "Toolbar",
	mixins: [Scrollable],

	data: () => ({
		MENU_DIVIDER,

		progress: 0,
		progressTask: null as any,
		executeSearchDebounced: null as unknown as Function,

		// Project creation
		newProjectDialog: false,
		newProjectName: "",
		newProjectDesc: "",
		newProjectLoading: false,
		tempMemberCount: 1,

		// Team creation
		newTeamDialog: false,
		newTeamName: "",
		newTeamDesc: "",
		newTeamLoading: false,

		// Search field
		isSearching: false,
		search: "" as string,
		searchResults: {} as SearchInterface|{}
	}),

	computed: {
		...mapState([
			'isWaiting'
		]),

		logoUrl(): boolean {
			return this.$store.state.isDark
				? require("/src/assets/vindigo-white.svg")
				: require("/src/assets/vindigo-black.svg");
		},
		userName(): Optional<string> {
			return this.$vuex.state.profile?.fullName;
		},
		waiterClass(): any {
			return {
				'toolbar__waiter--active': this.isWaiting
			};
		},
		toolbarClass(): any {
			return {
				"toolbar--sticky": (this as any).isScrolling,
			};
		},
		creationItems(): any {
			const items: any[] = [
				{
					icon: 'mdi mdi-folder-open',
					title: 'TOOLBAR_CREATE_PROJECT',
					description: 'TOOLBAR_CREATE_PROJECT_DESC',
					handler: this.openProjectCreation
				},
				{
					icon: 'mdi mdi-account-group',
					title: 'TOOLBAR_CREATE_TEAM',
					description: 'TOOLBAR_CREATE_TEAM_DESC',
					handler: this.openTeamCreation
				}
			];

			let separated = false;

			for(const matched of this.$route.matched) {
				const creation = matched.meta.creation as ToolbarCreationItem[];

				if(creation) {
					const component = matched.instances.default as any;
					const entries = creation.map((item) => {
						const handler = typeof item.handler == 'string'
							? component[item.handler]?.bind(component)
							: item.handler;

						return { ...item, handler };
					});

					if(entries.length > 0) {
						if(!separated) {
							items.push(MENU_DIVIDER);
							separated = true;
						}

						items.push(...entries);
					}
				}
			}

			return items;
		}
	},

	watch: {
		search() {
			this.searchResults = {};

			if(this.search.length < 3) {
				return;
			}

			this.executeSearchDebounced();
		},
		isWaiting() {
			this.progress = 0;
		}
	},

	created() {
		this.executeSearchDebounced = debounce(this.executeSearch, 500);

		// Simulate the progress bar slowly incrementing
		this.progressTask = setInterval(() => {
			if(this.isWaiting) {
				this.progress += Math.random() * 20;
			}
		}, 100);
	},

	destroyed() {
		clearInterval(this.progressTask);
	},

	methods: {
		getScrollView() {
			return this.$el.parentElement;
		},
		openProjectCreation() {
			this.newProjectDialog = true;
			this.newProjectName = "";
			this.newProjectDesc = "";
		},
		openTeamCreation() {
			this.newTeamDialog = true;
			this.newTeamName = "";
			this.newTeamDesc = "";
		},
		async createProject() {
			this.newProjectLoading = true;

			await api.query(gql`
				mutation ($data: ProjectCreationInput!) {
					createProject(details: $data) {
						id
					}
				}
			`, {
				data: {
					name: this.newProjectName,
					description: this.newProjectDesc,
					public: false
				}
			});

			this.newProjectLoading = false;
			this.newProjectDialog = false;
		},
		async createTeam() {
			this.newTeamLoading = true;

			await api.query(gql`
				mutation ($data: TeamCreationInput!) {
					createTeam(details: $data) {
						id
					}
				}
			`, {
				data: {
					name: this.newTeamName,
					description: this.newTeamDesc
				}
			});

			this.newTeamLoading = false;
			this.newTeamDialog = false;
		},
		async executeSearch() {
			const res = await api.query(gql`
				query ($sq: String!) {
					search(query: $sq) {
						projects {
							id
							name
						}
						users {
							id
							avatar
							fullName
						}
						teams {
							id
						}
					}
				}
			`, {
				sq: this.search
			});

			const result = res.search;
			const vals = values(result).map(it => it.length);
			const total = sum(vals);

			this.searchResults = {
				...result,
				present: true,
				total: total
			};
		}
	},
});
</script>

<style lang="postcss">
.toolbar {
	@apply flex items-center px-3 bg-white dark:bg-gray-800 h-14 sticky top-0 z-10 transition-shadow;

	&__waiter {
		@apply z-20 rounded-none -translate-y-1 transition-transform;

		&--active {
			@apply translate-y-0;
		}
	}

	&__divider {
		background-color: #e1e1e1;
		width: 2px;

		@apply h-10;
	}

	&__search {
		@apply absolute inset-x-0 mx-auto max-w-sm opacity-80 hover:opacity-100 transition-opacity;

		input {
			@apply text-gray-800;

			&::placeholder {
				@apply text-gray-500;
			}
		}

		.w-card {
			left: 0 !important;
			top: 28px !important;
			@apply rounded-md bg-white;
		}
	}

	&--sticky {
		@apply shadow-lg;
	}

	.o-drop__trigger {
		@apply flex items-center;
	}
}

.toolbar-menu {
	@apply bg-white overflow-hidden rounded-xl pt-3 w-60;
	@mixin emissive theme("colors.gray.400");

	&__title {
		@apply text-center mb-3 text-gray-800 font-semibold;
	}

	&__list {
		@apply overflow-hidden pb-1;
	}

	&__item {
		@apply px-3 py-2 cursor-pointer transition-colors text-gray-700 hover:bg-gray-100;

		.w-icon {
			@apply mt-[-3px] mr-1;
		}

		p {
			@apply text-sm;
		}
	}

	.w-divider {
		@apply my-1 border-gray-200;
	}
}

.addition-list {
	@apply flex;

	&__add-btn {
		@apply bg-indigo-600 w-12 h-12 m-1 rounded-full ring-4 ring-indigo-600 ring-opacity-40
		flex justify-center items-center text-white cursor-pointer;
	}
}
</style>