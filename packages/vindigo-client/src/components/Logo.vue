<template>
	<router-link to="/">
		<img
			:src="logoUrl"
			class="h-10 select-none"
			:class="imgClass"
			@dragstart.prevent
		>
	</router-link>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: 'Logo',

	props: ['imgClass'],

	computed: {
		logoUrl(): boolean {
			return this.$store.state.isDark
				? require("/src/assets/vindigo-white.svg")
				: require("/src/assets/vindigo-black.svg");
		}
	}
});
</script>