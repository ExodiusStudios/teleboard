<template>
	<div class="profile-page">
		<div class="profile-details">
			<w-flex wrap>
				<div class="picture-upload sm12 md2">
					<avatar
						v-if="preview == ''"
						class="block picture-upload__image"
						:profile="$vuex.state.profile"
					/>
					<img
						v-if="preview != ''"
						class="block picture-upload__image" 
						:src="preview || require('/assets/avatar-placeholder.svg')"
					>
					<file-upload
						v-model="avatar"
						class="mt-5 w-full" 
						@preview="showPreview"
					>
						<w-button class="w-full h-9 ml-0">
							Change
						</w-button>
					</file-upload>
				</div>
				<w-form class="sm12 md10 laptop:pl-5 mobile:pl-0">
					<label>
						Full name
					</label>
					
					<w-input
						v-model="fullname"
						class="mb-5"
					/>

					<label>
						Email address
					</label>
					<w-input
						v-model="email"
						class="mb-5"
					/>

					<label>
						Username
					</label>
					<w-input
						v-model="username"
						class="mb-5"
					/>

					<label>
						Bio <small>(Optional)</small>
					</label>
					<!-- REMOVE: :placeholder="$t('SETTINGS_PROFILE_BIO')" -->
					<w-textarea
						v-model="bio"
						class="mb-5"
						placeholder="Enter bio..."
					/>
	
					<label>
						Website <small>(Optional)</small>
					</label>
					<w-input
						v-model="website"
						placeholder="Enter website URL..."
					/>

					<w-button class="mt-5 -ml-0" @click="saveUserProfile">
						{{ $t('GENERAL_SAVE') }}
						<w-icon class="ml-2">
							mdi mdi-content-save
						</w-icon>
					</w-button>
				</w-form>
			</w-flex>
		</div>
	</div>
</template>

<script lang="ts">
import gql from 'graphql-tag';
import Vue from 'vue';
import { api } from '../../..';

export default Vue.extend({
	name: "ProfileTab",
	data: () => ({
		avatar: null,
		preview: '',
		fullname: '',
		email: '',
		username: '',
		bio: '',
		website: ''	 
	}),
	mounted() {
		const profile = this.$vuex.state.profile;
		
		// assigning each profile variable
		this.preview = profile!.avatar!;
		this.fullname = profile!.fullName;
		this.email = profile!.email!;
		this.username = profile!.username;
	},
	methods: {
		showPreview(preview: string) {
			this.preview = preview;
		},
		async saveUserProfile() {
			if(this.avatar != null) {
				await api.upload('avatar', this.avatar!);
			}
			
			const profile = {
				fullname: this.fullname,
				email: this.email,
				username: this.username,
				bio: this.bio,
				website: this.website
			};

			await api.query(gql`
				mutation($details: ProfileUpdate) {
					updateProfile(details: $details) {
						id
					}
				}
			`, {
				details: profile
			});

			this.$store.dispatch('updateProfile');
			this.$waveui.notify({
				message: this.$t("SETTINGS_PROFILE_UPDATE_SUCCESS"),
				success: true
			});
		}
	}
});
</script>

<style lang="postcss">

	.picture-upload {

		&__image {
			@apply bg-light-1 dark:bg-dark-3 rounded-full ;
			width: 148px;
			height: 148px;
		}
	}
</style>