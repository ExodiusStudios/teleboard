<template>
	<component :is="teamTag" :to="teamUrl">
		<div class="team bg-white dark:bg-gray-800" :style="teamStyle">
			<img
				v-if="imgSrc"
				:src="imgSrc"
				class="team__img"
			>
			<div
				v-else
				class="team__placeholder"
			>
				{{ teamAbbr }}
			</div>
		</div>
	</component>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Team } from '../../../vindigo-server/dist/models/team';
import { Optional } from '../typings/types';
import { cleanInt } from '../util';

export default Vue.extend({
	name: 'Avatar',
	props: {
		team: {
			type: Object as PropType<Team>,
			required: true
		},
		size: {
			type: [String, Number],
			default: 34
		},
		openTeam: {
			type: Boolean,
			default: true
		}
	},

	computed: {
		teamTag(): string {
			return this.openTeam ? `router-link` : 'span';
		},
		teamUrl(): Optional<string> {
			return `/profile/${this.team.id}`;
		},
		teamAbbr(): string {
			return this.team.name
				.split(' ')
				.map(s => s[0])
				.join('');
		},
		imgSrc(): Optional<string> {
			return this.team.logoImage;
		},
		teamStyle(): any {
			const size = cleanInt(this.size);

			return {
				width: size + 'px',
				height: size + 'px',
				fontSize: (size / 50) + 'em'
			};
		}
	}
});
</script>

<style lang="postcss">
.team {
	@apply rounded-lg overflow-hidden;

	image-rendering: crisp-edges;
	object-fit: cover;

	&__img {
		@apply w-full h-full object-cover;
	}
}

.team__placeholder {
	@apply bg-gray-100 flex items-center justify-center font-bold dark:bg-dark-2 w-full h-full;
}
</style>