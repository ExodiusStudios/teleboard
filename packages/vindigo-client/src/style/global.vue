<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&family=Ubuntu:wght@300;400;500;700&family=Lato:wght@100;300;400;700;900&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap');

.sortable-drag { opacity: 0; }

.container--thin {
	max-width: 1000px;
}

/* Custom utilities */
@layer utilities {
	@variants responsive {
		.text-shadow {
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.35);
		}
		
		.text-shadow-none {
			text-shadow: none;
		}
	} 
}

/* Scrollbar */

::-webkit-scrollbar {
	width: 11px;
	height: 11px;
	overflow: hidden;
	background-color: rgba(0, 0, 0, 0.13);
}

.dark ::-webkit-scrollbar {
	width: 11px;
	height: 11px;
	overflow: hidden;
	background-color: rgba(255, 255, 255, 0.065);
}

::-webkit-scrollbar-thumb {
	background-color: #788592;
	overflow: hidden;
}

::-webkit-scrollbar-thumb:hover {
	background-color: #607d97;
}

::-webkit-scrollbar-thumb:active {
	background-color: #445e77;
}

/* Caret color */

.dark {
	@apply caret-gray-400;
}

/* Structural classes */

.list-menu {
	@apply bg-white overflow-hidden rounded-xl pt-3 w-60;
	@mixin emissive theme("colors.gray.400");

	&__title {
		@apply text-center mb-3 text-gray-800 font-semibold;
	}

	&__list {
		@apply overflow-hidden pb-1;
	}

	&__item {
		@apply px-3 py-2 cursor-pointer transition-colors text-gray-700 hover:bg-gray-100;

		.w-icon {
			@apply mt-[-3px] mr-1;
		}

		p {
			@apply text-sm;
		}
	}

	.w-divider {
		@apply my-1 border-gray-200;
	}
}
</style>