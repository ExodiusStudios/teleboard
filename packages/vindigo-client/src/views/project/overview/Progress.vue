<template>
	<section class="statistics-card">
		<section-title icon="mdi mdi-chart-donut">
			{{ $t('PROJECT_OVERVIEW_SECTION_PROGRESS') }}
		</section-title>
		<div class="bg-light-2 flex flex-col rounded-3xl p-4 mt-2 h-52">
			Work in progress
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: 'ProgressBox'
});
</script>