<template>
	<div class="flex flex-col items-center pt-20">
		<logo
			img-class="h-16"
			class="mt-9 mb-6"
		/>
		<div class="maintenance-box">
			<div class="pb-3">
				<strong class="text-lg">
					{{ $t('MAINTENANCE_TITLE') }}
				</strong>
			</div>
			<p class="opacity-80">
				{{ $t('MAINTENANCE_DESC') }}
			</p>
		</div>
	</div>
</template>

<style lang="postcss">
.maintenance-box {
	@apply bg-light-2 dark:bg-dark-2 p-4 rounded-xl w-96 text-center;
}
</style>