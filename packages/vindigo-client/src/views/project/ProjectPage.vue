<template>
	<section class="project-page flex h-screen">
		<sidebar class="bg-[#2f3a41]" />
		<section class="flex flex-col flex-grow">
			<toolbar class="project-toolbar pl-0">
				<w-button
					v-wave
					class="mx-3 text-gray-700"
					icon="mdi mdi-chevron-down"
					to="#"
					xl
				/>
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
						class="toolbar-menu__item"
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
						<router-view />
					</keep-alive>
				</transition>
			</main>
		</section>
	</section>
</template>

<script lang="ts">
import Sidebar from './Sidebar.vue';
import Vue from "vue";
import { parseSlug, updateTitle } from '../../util';
import { api } from '../..';
import gql from 'graphql-tag';

async function fetchProjectData(id: number) {
	const res = await api.query(gql`
		query ($pid: Int!) {
			project(id: $pid) {
				id
				name
				coverImage
				projectUrl
			}
		}
	`, { pid: id });

	return res.project;
}

export default Vue.extend({
	name: 'ProjectPage',
	components: {
		Sidebar
	},

	async beforeRouteEnter(to, _from, next) {
		const pid = parseSlug(to.params.project);

		if(pid === undefined) {
			next('/'); // TODO Redirect to error page
			return;
		}

		const project = await fetchProjectData(pid);

		next((vm: any) => {
			updateTitle(project.name);

			vm.project = project;
		});
	},

	data: () => ({
		project: {} as any
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