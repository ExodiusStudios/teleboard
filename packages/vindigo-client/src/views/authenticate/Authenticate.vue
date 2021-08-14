<template>
	<section class="auth-page">
		<div class="h-72 bg-white dark:bg-gray-800" />
		<div class="auth-page__curve">
			<svg
				width="100%"
				viewBox="0 0 800 47"
				version="1.1"
				xml:space="preserve"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				class="fill-current text-white dark:text-gray-800"
			>
				<g transform="matrix(1,0,0,1,5.68434e-14,-203.925)">
					<path
						d="M-0,203.925L800,203.925L799.708,203.925C719.824,226.345 607.386,250 400,250L400,250L399.995,250L399.995,250C192.612,250 80.175,226.345 0.292,203.925L-0,203.925Z"
					/>
				</g>
			</svg>
		</div>
		<div class="-mt-44 desktop:-mt-32 px-8 z-10 relative">
			<img
				:src="logoUrl"
				class="h-16 mx-auto"
				:class="renderBoardName ? 'mb-4' : 'mb-10'"
			>
			<div
				v-if="renderBoardName"
				class="text-center font-semibold text-2xl text-gray-600 dark:text-gray-300 mb-6"
			>
				{{ boardName }}
			</div>
			<section class="auth-box block laptop:flex mx-auto">
				<div class="auth-box__left">
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
				<div class="auth-box__right">
					<div class="h-full flex items-center justify-center">
						<img :src="require('/src/assets/login-illustration.svg')">
					</div>
				</div>
			</section>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from "vue";
import SignIn from "./Signin.vue";
import SignUp from "./Register.vue";
import { RootState } from "../../registry/store/state";

export default Vue.extend({
	name: "Authenticate",

	data: () => ({
		isSigningUp: false,
	}),

	computed: {
		logoUrl(): boolean {
			return this.$store.state.isDark
				? require("/src/assets/vindigo-white.svg")
				: require("/src/assets/vindigo-black.svg");
		},
		boardName(): string {
			return (this.$store.state as RootState).config.instanceName;
		},
		renderBoardName(): boolean {
			return this.boardName.toLowerCase() != "vindigo";
		},
		authView() {
			return this.isSigningUp ? SignUp : SignIn;
		},
	},
});
</script>

<style lang="postcss">
::-ms-reveal {
    display: none;
}

.auth-page__curve {
	@apply relative z-0;

	svg {
		@apply absolute;
	}
}

.auth-box {
	@apply relative;

	width: 100%;
	max-width: 735px;

	.w-input__input-wrap, .w-select__selection-wrap {
		@apply border-none bg-white text-sm h-9 rounded-lg ring-4 ring-white ring-opacity-40;

		&--round, &--round input {
			@apply rounded-full;
		}
	}

	.w-textarea__textarea-wrap {
		@apply border-none ring-4 ring-white bg-white ring-opacity-30 text-sm;

		&--round input {
			@apply rounded-full;
		}

		&::after {
			display: none;
		}
	}

	&__left {
		@apply rounded-2xl laptop:rounded-tr-none laptop:rounded-br-none flex-1 px-8 py-4 text-center dark:z-10;
		@mixin emissive theme("colors.blue.500"), 0.75;

		background: linear-gradient(
			135deg,
			rgb(2, 198, 255) 0%,
			rgb(105, 67, 255) 100%
		);
	}

	&__right {
		@apply rounded-tr-2xl rounded-br-2xl flex-1 px-8 py-4 bg-white dark:bg-gray-800 hidden laptop:block;
		@mixin emissive theme("colors.gray.300");
	}

	&__left, &__right {
		height: 25rem;
	}

	&__toggle {
		@apply font-light text-sm mt-3 cursor-pointer select-none text-gray-100;

		strong {
			@apply font-semibold;
		}
	}

	/* Dark mode emission overrrides */

	.dark &__left {
		@mixin emissive theme("colors.blue.500"), 0.5;
	}

	.dark &__right {
		@mixin emissive theme("colors.black");
	}
}
</style>