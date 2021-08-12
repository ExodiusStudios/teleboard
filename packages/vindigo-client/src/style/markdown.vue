<style lang="postcss">
.markdown-enabled {

	p {
		@apply pt-0 mb-3;
	}

	a {
		@apply text-accent-1;
	}

	hr {
		@apply bg-light-2 dark:bg-dark-2;

		border: 0;
		height: .25em;
		margin: 24px 0;
		padding: 0;
	}

	ul, ol {
		padding-left: 2em;
		list-style-type: circle;
	}

	h1, h2, h3, h4, h5, h6 {
		font-weight: 500;
		line-height: 1.25;
		margin-bottom: 16px;
		margin-top: 24px;
	}

	h1, h2 {
		@apply border-b-2 border-light-2 dark:border-dark-2;

		padding-bottom: .15em;
	}

	h1 {
		font-size: 2em;
	}

	h2 {
		font-size: 1.5em;
	}

	h3 {
		font-size: 1.25em;
	}

	h4 {
		font-size: 1em;
	}

	h5, h6 {
		font-size: .875em;
	}

	h6 {
		@apply text-gray-500;
	}

	img, svg, video, canvas, audio, iframe, embed, object {
		display: inline;
	}

	code, tt {
		@apply bg-light-3 dark:bg-dark-3 p-0 mb-3 rounded;

		font-size: 85%;
		margin: 0;
	}

	pre {
		@apply bg-light-2 dark:bg-dark-2 p-3 mb-3 rounded-lg overflow-auto;

		font-size: 85%;
		line-height: 1.45;
		word-break: normal;
		word-wrap: normal;
	
		code, tt {
			@apply bg-transparent;
		}
	}
	
}
</style>