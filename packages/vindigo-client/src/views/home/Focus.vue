<template>
	<section class="focus-tasks">
		<section-title icon="mdi mdi-check-circle-outline">
			{{ $t('HOMEPAGE_SECTION_FOCUS') }}
		</section-title>
		<div class="focus-tasks__content rounded-2xl p-4 bg-[#DDE0EB] dark:bg-gray-800 mt-2 h-36">
			<!-- TODO Focus task -->
		</div>
	</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "FocusTasks",
});
</script>