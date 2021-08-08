<template>
	<section class="sign-up flex flex-col">
		<h1
			class="
				font-semibold
				text-white text-2xl
				uppercase
				tracking-widest
				py-3
			"
		>
			{{ $t("SIGNIN_SIGNIN") }}
		</h1>
		<w-form class="flex flex-col h-full">
			<section>
				<w-input
					v-model="email"
					class="auth-box__input my-5 text-center"
					:placeholder="$t('GENERAL_EMAIL')"
					autocomplete="sign-up email"
					name="email"
					round
				/>
				<w-input
					v-model="fullname"
					class="auth-box__input my-5 text-center"
					:placeholder="$t('GENERAL_FULL_NAME')"
					autocomplete="sign-up name"
					name="name"
					round
				/>
				<w-input
					v-model="password"
					class="auth-box__input my-5"
					:placeholder="$t('SIGNIN_PASSWORD')"
					password-reveal
					autocomplete="sign-up password"
					type="password"
					name="password"
					round
				/>
			</section>
			<div class="flex text-white">
				<w-checkbox v-model="remember" round>
					{{ $t("SIGNIN_REMEMBER_ME") }}
				</w-checkbox>
			</div>
			<spacer />
			<w-button
				round
				class="w-full h-9 auth-box__button"
				color="white"
				bg-color="accent-3"
				type="submit"
				:loading="loading"
				@click="register"
			>
				{{ $t("SIGNIN_REGISTER_ACCOUNT") }}
				<w-icon>
					mdi mdi-chevron-right
				</w-icon>
			</w-button>
		</w-form>
		<div class="auth-box__toggle" @click="$emit('toggle')">
			<div v-html="$t('SIGNIN_HAVE_ACCOUNT')" />
		</div>
	</section>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "Register",

	data: () => ({
		fullname: "",
		email: "",
		password: "",
		remember: false,
		loading: false,
	}),

	methods: {
		async register() {
			this.loading = true;

			await this.$vuex.dispatch("signUp", {
				fullname: this.fullname,
				email: this.email,
				password: this.password,
				remember: this.remember,
			});

			this.loading = false;
		},
	},
});
</script>

<style lang="postcss">

.sign-up {

	.auth-box__input input {
		@apply text-gray-600;
	}

}

</style>