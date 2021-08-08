<template>
	<div class="profile-page">
		<div class="profile-avatar">
			<div class="avatar-upload">
				Profile Picture
				<file-upload 
					v-model="avatar" 
					class="avatarUpload" 
					@preview="showPreview"
				>
					<w-button>
						Change
					</w-button>
				</file-upload>
				<avatar
					v-if="preview == ''"
					class="preview"
					:profile="$vuex.state.profile"
				/>
				<img 
					v-if="preview != ''"
					class="preview" 
					:src="preview"
				>
			</div>
		</div>

		<w-divider class="avatar-details-divider" />
		
		<div class="profile-details">
			<w-input
				v-model="fullname"
				:placeholder="$t('GENERAL_FULL_NAME')"
				tile inner-icon-left="mdi mdi-account"
				inner-icon-right="mdi mdi-exclamation-thick text-red-500"
			/>

			<w-input
				v-model="email"
				class="mt-5"
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
				:placeholder="$t('SETTINGS_PROFILE_BIO') + ' (Optional)'"
			/>
	
			<w-input
				v-model="website"
				class="mt-5"
				:placeholder="$t('SETTINGS_PROFILE_WEBSITE') + ' (Optional)'"
				tile inner-icon-left="mdi mdi-earth"
			/>

			<w-button class="mt-5 -ml-0" @click="saveUserProfile">
				{{ $t("SETTINGS_PROFILE_SAVE") }}
				<w-icon class="ml-2">
					mdi mdi-content-save
				</w-icon>
			</w-button>
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
	.profile-avatar {
		.preview {
			width: 100px;
			height: 100px;
		}
		.avatarUpload {
			@apply flex-grow;

			margin-top: 10px;
			display: inline-block;
			justify-self: right;
			position: sticky;
		}
	}
	.avatar-details-divider {
		@apply my-6 h-1 bg-gray-200 dark:bg-gray-200;
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