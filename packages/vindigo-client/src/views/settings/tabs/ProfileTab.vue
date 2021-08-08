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
						:src="preview"
					>
					<file-upload
						class="mt-5 w-full"
						v-model="avatar" 
						@preview="showPreview"
					>
						<w-button class="w-full h-9 ml-0">
							Change
						</w-button>
					</file-upload>
				</div>
				<div class="sm12 md10 laptop:pl-5 mobile:pl-0">
					<w-input
						class="co"
						v-model="fullname"
						:placeholder="$t('GENERAL_FULL_NAME')"
						tile inner-icon-left="mdi mdi-account"
						inner-icon-right="mdi mdi-exclamation-thick text-red-500"
					/>

					<w-input
						v-model="email"
						class="mt-5 flex-1"
						:placeholder="$t('GENERAL_EMAIL')"
						tile inner-icon-left="mdi mdi-mail"
						inner-icon-right="mdi mdi-exclamation-thick text-red-500"
					/>

					<w-input
						v-model="username"
						class="mt-5"
						:placeholder="$t('GENERAL_USERNAME')"
						tile inner-icon-left="mdi mdi-account"
						inner-icon-right="mdi mdi-exclamation-thick text-red-500"
					/>
					<w-textarea
						v-model="bio"
						class="mt-5"
						:placeholder="$t('SETTINGS_PROFILE_BIO')"
					/>
	
					<w-input
						v-model="website"
						class="mt-5"
						:placeholder="$t('SETTINGS_PROFILE_WEBSITE')"
						tile inner-icon-left="mdi mdi-earth"
					/>

					<w-button class="mt-5 -ml-0" @click="saveUserProfile">
						{{ $t("SETTINGS_PROFILE_SAVE") }}
						<w-icon class="ml-2">
							mdi mdi-content-save
						</w-icon>
					</w-button>
				</div>
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

	.profile-details {

		.w-input {
			@apply rounded-md bg-light-3 px-3 outline-none overflow-hidden;

			&__input-wrap, &--filled, &:not(&--filled) {
				@apply bg-light-3 dark:bg-dark-3;
			}
		}

		.w-input input, .w-textarea textarea {
			@apply text-gray-500 dark:text-white;
		}

		.w-input--focused {
			outline: unset !important;
		}

		.w-textarea {
			@apply bg-light-3 rounded-lg overflow-hidden dark:bg-dark-3;

			&__textarea {
				@apply bg-light-3 px-3 py-2 dark:bg-dark-3;
			}

			&__textarea-wrap {
				@apply bg-light-3 dark:bg-dark-3;
			}
		}
	}
</style>