<style lang="postcss">

/* Notification center */
.w-notification-manager {
	@apply overflow-x-hidden p-4 pt-16 w-96;

	.w-alert {
		@apply border-0 border-l-4 bg-white p-3 rounded-md;

		box-shadow: 0 2px 18px rgba(64, 64, 64, 0.3);

		&__icon {
			@apply text-2xl;
		}

		&__content {
			@apply text-gray-700;
		}

		&__dismiss {
			@apply text-gray-700;

			.w-icon {
				@apply text-2xl;
			}
		}

		& > * {
			align-self: initial;
		}
	
		&::after {
			@apply bg-transparent;
		}
	}
}

/* Top level inputs */
.w-input, .w-select, .w-textarea {
	@apply transition-shadow;

	&:not(&--outline) {
		@apply border-none;
	}

	.dark & input,
	.dark & .w-input__icon,
	.dark & .w-select__icon {
		@apply text-light;
	}

	input, textarea, select {
		@apply text-gray-600 dark:text-white text-sm;
	}
}

/* Input wrappers */
.w-input__input-wrap,
.w-textarea__textarea-wrap,
.w-select__selection-wrap {
	@apply border-none rounded-md;
	@apply pl-2 py-1 !important;

	&--round {
		@apply rounded-full;

		input {
			@apply pl-1 !important;
		}
	}

	&::after {
		display: none;
	}

}

/* Input specific */
.w-input {
	&__input-wrap {
		@apply px-1 bg-light-3 dark:bg-dark-3;
	}
}

/* Select specific */
.w-select {
	&__select-wrap {
		@apply px-1 bg-light-3 dark:bg-dark-3;
	}
}

/* Textarea specific */
.w-textarea {
	&__textarea-wrap {
		@apply px-1 bg-light-3 dark:bg-dark-3;
	}
}

/* Add padding for inner icons */
.w-select--inner-icon-left input {
	@apply pl-8 !important;
}

/* Input focusing */
.w-input--focused .w-input__input-wrap,
.w-textarea--focused .w-textarea__textarea-wrap,
.w-select--focused .w-select__select-wrap {
	@apply ring-2 ring-accent-1 outline-none;
}

/* Checkboxes */
.w-checkbox__input {
	@apply text-red-500;

	&::after {
		@apply border-white;
	}
}

/* Buttons */
.w-button {
	@apply leading-none px-4 py-4 rounded-lg ml-2 font-semibold;

	&__loader {
		@apply rounded-lg;
	}

	&:not(&--outline) {
		@apply border-none;
	}

	&--round .w-button__loader {
		@apply rounded-full;
	}

	&--icon:not(.bg) {
		@apply bg-transparent border-none !important;
	}

	/* Slightly nudges button icons down by one pixel */
	& > .w-icon {
		@apply leading-normal;
	}
}

/** Divider */
.w-divider {
	@apply my-3 bg-gray-900 dark:bg-gray-300;
}

/** Select */
.w-select {
	@apply dark:text-white;

	&__selection, &__label {
		@apply dark:text-gray-50;
	}

	&__menu {
		@apply dark:bg-gray-700;
	}
}

/** List */
.w-list {

	&__item-label.primary {
		@apply dark:bg-white;
	}
}

/** Tooltips */
.w-tooltip {
	@apply bg-dark border-dark border-opacity-70 bg-opacity-70 border-none text-white py-0.5;
	
	&::after {
		@apply hidden;
	}
}

</style>