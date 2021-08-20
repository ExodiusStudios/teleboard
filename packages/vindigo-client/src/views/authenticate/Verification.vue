<template>
	<auth-layout>
		<div class="auth-box__flat auth-box__flat--round h-52 text-center flex flex-col">
			<div class="font-bold text-2xl py-4">
				Success!
			</div>
			<div class="text-base">
				You've verified your email address.
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
import gql from "graphql-tag";
import Vue from "vue";
import { api } from "../..";
import AuthLayout from "./AuthLayout.vue";

export default Vue.extend({
	name: "Verification",

	components: {
		AuthLayout
	},

	async beforeRouteEnter(to, _from, next) {
		const code = to.params.code;

		// Verify the account
		const res = await api.query(gql`
			mutation ($code: String!) {
				verifyAccount(code: $code)
			}
		`, { code });

		// if(!res.verifyAccount) {
		// 	next('/');
		// 	return;
		// }

		next();
	},
});
</script>