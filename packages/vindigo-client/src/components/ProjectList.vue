<template>
	<div class="project-list">
		<div v-if="!projects.length" class="project-list__empty">
			<slot name="empty" />
		</div>
		<w-tabs
			v-else
			ref="tabs"
			v-model="currentPage"
			class="project-list__tabs"
			:items="pageContents"
		>
			<template #item-content="{ item }">
				<div class="grid grid-cols-12 gap-5 pt-4">
					<router-link
						v-for="project in item.content"
						:key="project.id"
						:to="project.projectUrl || '/'"
						class="project-tile"
						:class="tileClass(project)"
					> 
						<div
							v-if="project.coverImage"
							class="project-tile__cover"
							:style="tileStyle(project)"
						/>
						<div class="project-tile__overlay" />
						<div class="project-tile__title">
							{{ project.name }}
						</div>
					</router-link>
				</div>
			</template>
		</w-tabs>
		<pagination
			v-if="projects.length > projectsPerPage"
			:value="currentPage"
			:total="pageCount"
			:visible="5"
			class="mt-4"
			@input="openPage"
		/>
	</div>
</template>

<script lang="ts">
import { chunk } from 'lodash';
import Vue from 'vue';

export default Vue.extend({
	name: 'ProjectList',
	props: {
		projects: {
			type: Array,
			required: true
		},
		rows: {
			type: Number,
			required: true
		}
	},

	data: () => ({
		currentPage: 0
	}),

	computed: {
		projectsPerPage(): number {
			return this.rows * 4;
		},
		pageCount(): number {
			return Math.ceil(this.projects.length / this.projectsPerPage);
		},
		pageContents(): any[] {
			const grouped = chunk(this.projects, this.projectsPerPage);

			return grouped.map((group: any[]) => ({
				title: 'Bruh',
				content: group
			}));
		}
	},

	methods: {
		openPage(page: number) {
			const tabs = (this.$refs.tabs as any);

			tabs.openTab({ _index: page });
		},
		tileStyle(project: any): any {
			return {
				backgroundImage: project.coverImage ? `url(${project.coverImage})` : undefined
			};
		},
		tileClass(project: any): any {
			return {
				'project-tile--cover': !!project.coverImage
			};
		}
	}
});
</script>

<style lang="postcss">
.project-list {

	&__tabs {
		@apply border-none;

		.w-tabs__bar {
			@apply hidden;
		}

		.w-tabs__content {
			@apply p-0;
		}
	}
	
}

.project-tile {
	@apply h-32 bg-light-2 dark:bg-dark-2 rounded-xl p-4 col-span-12 laptop:col-span-6 desktop:col-span-3 bg-cover relative overflow-hidden;

	&__title {
		@apply text-gray-700 dark:text-gray-200 font-bold;
	}

	&--cover {
		.project-tile__cover {
			@apply absolute inset-0 bg-center bg-cover transition-transform;
		}

		.project-tile__overlay {
			@apply absolute inset-0 bg-black bg-opacity-20 transition-colors;
		}

		.project-tile__title {
			@apply relative text-light pointer-events-none;

			text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6), 1px 1px 9px rgba(75, 75, 75, 0.5);
		}

		&:hover {
			.project-tile__cover {
				@apply scale-105;
			}

			.project-tile__overlay {
				@apply bg-opacity-25;
			}
		}
	}
}
</style>