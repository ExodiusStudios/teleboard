<template>
	<div class="profile-page">
		<w-input
			v-model="fullname"
			placeholder="Volledige naam"
			tile inner-icon-left="mdi mdi-account"
			inner-icon-right="mdi mdi-exclamation-thick text-red-500"
		/>

		<w-input
			v-model="email"
			class="mt-5"
			placeholder="Email"
			tile inner-icon-left="mdi mdi-mail"
			inner-icon-right="mdi mdi-exclamation-thick text-red-500"
		/>

		<w-input
			v-model="username"
			class="mt-5"
			placeholder="Username"
			tile inner-icon-left="mdi mdi-account"
			inner-icon-right="mdi mdi-exclamation-thick text-red-500"
		/>

		<w-textarea
			v-model="bio"
			class="mt-5"
			placeholder="Bio (Optional)"
		/>
 
		<w-input
			v-model="website"
			class="mt-5"
			placeholder="Website (Optional)"
			tile inner-icon-left="mdi mdi-earth"
		/>

		<w-button class="mt-5 -ml-0" @click="saveUserProfile">
			{{ $t("SETTINGS_PROFILE_SAVE") }}
			<w-icon class="ml-2">
				mdi mdi-content-save
			</w-icon>
		</w-button>
	</div>
</template>

<script lang="ts">
import gql from 'graphql-tag';
import Vue from 'vue';
import { api } from '../../..';

export default Vue.extend({
	name: "ProfileTab",
	data: () => ({
		fullname: '',
		email: '',
		username: '',
		bio: '',
		website: ''	 
	}),
	mounted() {
		const profile = this.$vuex.state.profile;
		
		// assigning each profile variable
		this.fullname = profile!.fullName;
		this.email = profile!.email!;
		this.username = profile!.username;
	},
	methods: {
		async saveUserProfile() {
			
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
		}
	}
});
</script>

<style lang="postcss">
	.profile-page {

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