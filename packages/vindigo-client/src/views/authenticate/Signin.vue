<template>
	<section class="sign-in flex flex-col">
		<h1
			class="
				font-semibold
				text-white text-2xl
				uppercase
				tracking-widest
				py-3
			"
		>
			{{ $t("SIGNIN_WELCOME") }}
		</h1>
		<w-form class="flex flex-col h-full">
			<section>
				<w-input
					v-model="identity"
					class="auth-box__input my-5"
					:placeholder="$t('SIGNIN_USERNAME')"
					autocomplete="sign-in email"
					round
				/>
				<w-input
					v-model="password"
					class="auth-box__input my-5"
					:placeholder="$t('SIGNIN_PASSWORD')"
					autocomplete="sign-in password"
					type="password"
					round
				/>
			</section>
			<div class="flex text-white">
				<w-checkbox v-model="remember" round>
					{{ $t("SIGNIN_REMEMBER_ME") }}
				</w-checkbox>
				<spacer />
				<a class="text-white" href="">
					{{ $t("SIGNIN_FORGOT_PASSWORD") }}
				</a>
			</div>
			<spacer />
			<w-button
				round
				class="w-full h-9 auth-box__button"
				color="white"
				bg-color="accent-3"
				type="submit"
				:loading="loading"
				@click="authenticate"
			>
				{{ $t("SIGNIN_SIGNIN") }}
				<w-icon>
					mdi mdi-chevron-right
				</w-icon>
			</w-button>
		</w-form>
		<div
			v-if="canRegister"
			class="auth-box__toggle"
			@click="$emit('toggle')"
		>
			<div v-html="$t('SIGNIN_NO_ACCOUNT')" />
		</div>
	</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "SignIn",

	data: () => ({
		identity: "",
		password: "",
		remember: false,
		loading: false,
	}),

	computed: {
		canRegister() {
			return this.$config.allowRegister;
		},
	},

	methods: {
		async authenticate() {
			this.loading = true;

			const profile = await this.$vuex.dispatch("signIn", {
				identity: this.identity,
				password: this.password,
				remember: this.remember,
			});

			if (!profile) {
				this.$waveui.notify(this.$t("NOTIFICATION_INVALID_DETAILS"), "error");
			} else {
				this.$router.push('/');
			}

			this.loading = false;
		},
	},
});
</script>

<style lang="postcss">
.sign-in {

	.auth-box__input input {
		@apply text-gray-600;
	}

}
</style>