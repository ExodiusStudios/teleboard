<template>
	<section class="your-projects mb-14">
		<section-title icon="mdi mdi-folder-open">
			{{ $t('HOMEPAGE_SECTION_PROJECTS') }}
		</section-title>
		<project-list :projects="projects" :rows="2">
			<template #empty>
				<div class="your-projects__empty">
					<w-icon color="white" size="3.5em">
						mdi mdi-auto-fix
					</w-icon>
					<div class="text-lg pt-4 font-semibold leading-snug">
						{{ $t('HOMEPAGE_NO_PROJECTS') }}
					</div>
					<div class="pb-5">
						Maak een project aan om te beginnen!
					</div>
					<div>
						<w-button
							class="ml-0"
							color="white"
							bg-color="indigo-700"
							@click="$emit('create')"
						>
							{{ $t('TOOLBAR_CREATE_PROJECT') }}
							<w-icon class="ml-2">
								mdi mdi-plus
							</w-icon>
						</w-button>
					</div>
				</div>
			</template>
		</project-list>
	</section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
	name: 'YourProjects',

	props: {
		projects: {
			type: Array as PropType<any[]>,
			required: true
		}
	}
	
});
</script>

<style lang="postcss">
.your-projects__empty {
	@apply flex flex-col items-center mt-4 pb-6 pt-5 text-white rounded-3xl;
	@mixin emissive theme("colors.blue.500"), 0.75;

	background: linear-gradient(
		135deg,
		rgb(2, 198, 255) 0%,
		rgb(105, 67, 255) 100%
	);

	.dark & {
		@mixin emissive theme("colors.blue.500"), 0.5;
	}
}
</style>