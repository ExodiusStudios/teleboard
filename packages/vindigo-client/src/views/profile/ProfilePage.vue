<template>
	<section class="profile-page">
		<toolbar class="pl-0" />
		
		<main class="container mt-20">
			<file-upload v-model="avatar" @preview="showPreview">
				<w-button>
					Select avatar
				</w-button>
			</file-upload>
			<img :src="preview">
			<w-button :disabled="!avatar" @click="uploadAvatar">
				Upload avatar
			</w-button>
		</main>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import { api } from '../..';

export default Vue.extend({
	name: 'ProfilePage',

	data: () => ({
		avatar: null,
		preview: ''
	}),

	computed: {
		userId(): number {
			return this.$vuex.state.profile!.id;
		}
	},

	methods: {
		showPreview(preview: string) {
			this.preview = preview;
		},
		async uploadAvatar() {
			await api.upload('avatar', this.avatar!);

			this.$store.dispatch('updateProfile');
		}
	}
});
</script>