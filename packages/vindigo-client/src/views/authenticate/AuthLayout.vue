<template>
	<section class="auth-layout">
		<div class="h-72 bg-white dark:bg-gray-800" />
		<div class="auth-layout__curve">
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
				<slot />
			</section>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from "vue";
import SignIn from "./Signin.vue";
import SignUp from "./Register.vue";
import { RootState } from "../../store/state";
import { store } from "../..";

export default Vue.extend({
	name: "Authenticate",

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
		logoUrl(): boolean {
			return this.$store.state.isDark
				? require("/src/assets/vindigo-white.svg")
				: require("/src/assets/vindigo-black.svg");
		},
		boardName(): string {
			return (this.$store.state as RootState).config.instanceName;
		},
		renderBoardName(): boolean {
			return this.boardName.toLowerCase() != 'vindigo';
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

.auth-layout__curve {
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
}
</style>