<template>
	<component :is="avatarTag" :to="profileUrl">
		<div class="avatar inline-flex rounded-full bg-gradient-to-b from-yellow-500 to-pink-600" :style="borderStyle">
			<div class="avatar__space rounded-full bg-white dark:bg-gray-800" :style="borderStyle">
				<img
					v-if="imgSrc"
					:src="imgSrc"
					:style="imgStyle"
					class="avatar__img"
				>
				<div
					v-else
					:style="imgStyle"
					class="avatar__placeholder"
				>
					{{ nameAbbr }}
				</div>
			</div>
		</div>
	</component>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Profile } from '../model/profile';
import { Optional } from '../typings/types';
import { cleanInt } from '../util';

export default Vue.extend({
	name: 'Avatar',
	props: {
		profile: {
			type: Object as PropType<Profile>,
			required: true
		},
		size: {
			type: [String, Number],
			default: 34
		},
		openProfile: {
			type: Boolean,
			default: true
		}
	},

	computed: {
		avatarTag(): string {
			return this.openProfile ? `router-link` : 'span';
		},
		profileUrl(): Optional<string> {
			return `/profile/${this.profile.id}`;
		},
		borderStyle(): any {
			return {
				padding: Math.max(2, Math.ceil(cleanInt(this.size) / 24)) + 'px'
			};
		},
		nameAbbr(): string {
			return this.profile.fullName
				.split(' ')
				.map(s => s[0])
				.join('');
		},
		imgSrc(): Optional<string> {
			return this.profile.avatar;
		},
		imgStyle(): any {
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
.avatar {
	-webkit-user-select: none;
	user-select: none;
}
.avatar__img {
	@apply rounded-full;

	image-rendering: crisp-edges;
	object-fit: cover;
}

.avatar__placeholder {
	@apply bg-light-3 rounded-full flex items-center justify-center font-bold dark:bg-dark-2;
}
</style>