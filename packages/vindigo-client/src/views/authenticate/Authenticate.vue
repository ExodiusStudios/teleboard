<template>
	<auth-layout>
		<div class="auth-box__prominent">
			<div class="relative h-full">
				<zoom-x-transition>
					<component
						:is="authView"
						class="absolute inset-0"
						@toggle="isSigningUp = !isSigningUp"
					/>
				</zoom-x-transition>
			</div>
		</div>
		<div class="auth-box__flat">
			<div class="h-full flex items-center justify-center">
				<img :src="require('/src/assets/login-illustration.svg')">
			</div>
		</div>
	</auth-layout>
</template>

<script lang="ts">
import Vue from "vue";
import SignIn from "./Signin.vue";
import SignUp from "./Register.vue";
import AuthLayout from "./AuthLayout.vue";
import { store } from "../..";

export default Vue.extend({
	name: "Authenticate",

	components: {
		AuthLayout,
	},

	beforeRouteEnter(_to, _from, next) {
		if(store.instance.state.profile) {
			next('/');
		} else {
			next();
		}
	},

	data: () => ({
		isSigningUp: false,
	}),

	computed: {
		authView() {
			return this.isSigningUp ? SignUp : SignIn;
		}
	}
});
</script>

<style lang="postcss">
.auth-box {
	&__prominent {
		@apply rounded-2xl laptop:rounded-tr-none laptop:rounded-br-none flex-1 px-8 py-4 text-center dark:z-10;
		@mixin emissive theme("colors.blue.500"), 0.75;

		background: linear-gradient(
			135deg,
			rgb(2, 198, 255) 0%,
			rgb(105, 67, 255) 100%
		);
	}

	&__flat {
		@apply rounded-tr-2xl rounded-br-2xl flex-1 px-8 py-4 bg-white dark:bg-gray-800 hidden laptop:block;
		@mixin emissive theme("colors.gray.300");

		&--round {
			@apply rounded-2xl;
		}
	}

	&__prominent, &__flat {
		height: 25rem;
	}

	&__toggle {
		@apply font-light text-sm mt-3 cursor-pointer select-none text-gray-100;

		strong {
			@apply font-semibold;
		}
	}

	/* Dark mode emission overrrides */

	.dark &__prominent {
		@mixin emissive theme("colors.blue.500"), 0.5;
	}

	.dark &__flat {
		@mixin emissive theme("colors.black");
	}
}
</style>