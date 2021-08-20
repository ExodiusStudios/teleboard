<template>
	<auth-layout>
		<!-- NOTE No need for translating this! -->

		<div class="auth-box__flat auth-box__flat--round h-64 text-center flex flex-col">
			<div class="font-bold text-2xl py-4">
				Congratulations!
			</div>
			<div class="text-base">
				You've successfully created your account.<br>
				Please check your inbox for a verification email.
			</div>
			<spacer />
			<w-button
				bg-color="accent-1"
				color="white"
				class="mb-2"
				route="/"
			>
				Continue to homepage
			</w-button>
		</div>
	</auth-layout>
</template>

<script lang="ts">
import Vue from "vue";
import AuthLayout from "./AuthLayout.vue";

export default Vue.extend({
	name: "Completion",

	components: {
		AuthLayout
	}
});
</script>