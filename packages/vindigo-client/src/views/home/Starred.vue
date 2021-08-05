<template>
	<section class="your-projects mb-14">
		<section-title icon="mdi mdi-star">
			{{ $t('HOMEPAGE_SECTION_STARRED') }}
		</section-title>
		<project-list :projects="starred" :rows="1" />
	</section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
	name: 'StarredProjects',

	props: {
		starred: {
			type: Array as PropType<any[]>,
			required: true
		}
	}
	
});
</script>