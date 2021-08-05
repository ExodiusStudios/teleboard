<template>
	<section class="your-teams">
		<section-title icon="mdi mdi-account-group">
			{{ $t('HOMEPAGE_SECTION_TEAMS') }}
		</section-title>
		<div
			v-for="team in teams"
			:key="team.id"
			class="your-teams__team-row mt-4 mb-14"
		>
			<div class="your-teams__toolbar p-2 px-3 flex flex-row items-center bg-light-2 dark:bg-dark-2 rounded-lg">
				<w-image
					:src="team.logoImage"
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
					color="accent-1"
					:route="team.teamUrl"
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
			/>
		</div>
	</section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
	name: 'YourTeams',

	props: {
		teams: {
			type: Array as PropType<any[]>,
			required: true
		}
	},

	data: () => ({
		currentPages: {}
	}),

	created() {
		for(const team of this.teams) {
			this.$set(this.currentPages, team.id, 0);
		}
	}

});
</script>