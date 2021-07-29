<template>
	<section class="your-teams">
		<section-title icon="mdi mdi-account-group">
			{{ $t('HOMEPAGE_SECTION_TEAMS') }}
			<!-- <spacer />
			<w-button
				v-wave
				color="white"
				bg-color="indigo-600"
				class="px-4 py-4 rounded-lg ml-2 font-semibold"
			>
				<w-icon class="mr-2">
					mdi mdi-plus
				</w-icon>
				New team
			</w-button> -->
		</section-title>
		<div
			v-for="team in teams"
			:key="team.id"
			class="your-teams__team-row mt-4 mb-14"
		>
			<div class="your-teams__toolbar p-2 px-3 flex flex-row items-center bg-page-foreground dark:bg-page-foreground-dark rounded-lg">
				<w-image
					:src="team.logo"
					class="rounded-lg overflow-hidden"
					height="38"
					width="38"
				/>
				<div class="pl-3 flex flex-col dark:text-white">
					<span class="font-semibold text-base">
						{{ team.name }}
					</span>
					<span class="text-sm">
						{{ $t('HOMEPAGE_SECTION_TEAMS_MEMBER') }}
					</span>
				</div>
				<spacer />
				<w-button
					outline
					color="indigo-600"
				>
					{{ $t('HOMEPAGE_SECTION_TEAMS_VISIT') }}
					<w-icon>
						mdi mdi-arrow-right
					</w-icon>
				</w-button>
			</div>
			<project-list
				class="mb-5"
				:projects="team.projects"
				:rows="2"
			>
				<template #empty>
					<div class="bg-white p-3">
						This team has no projects yet
					</div>
				</template>
			</project-list>
		</div>
	</section>
</template>

<script lang="ts">
import { commerce } from 'faker';
import { datatype } from 'faker';
import Vue from 'vue';

export default Vue.extend({
	name: 'YourTeams',

	data: () => ({
		page: 0,
		teams: [] as any[]
	}),

	created() {
		this.teams = [
			{
				id: 1,
				logo: '/data/teams/1.png',
				name: 'Exodius Studios',
				projects: this.genProjects()
			},
			{
				id: 2,
				logo: '/data/teams/2.png',
				name: 'Smash Wizards',
				projects: this.genProjects()
			}
		];
	},

	methods: {
		genProjects(): any {
			const amount = datatype.number(20);
			const projects: any[] = [];

			for(let i = 0; i < amount; i++) {
				projects.push({
					id: datatype.uuid(),
					name: commerce.productName()
				});
			} 

			return projects;
		}
	}
});
</script>