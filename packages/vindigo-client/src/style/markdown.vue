<style lang="postcss">
.markdown-enabled {

	p {
		@apply pt-0 mb-3;
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

		font-size: 95%;
		line-height: 1.4;
		word-break: normal;
		word-wrap: normal;
	
		code, tt {
			@apply bg-transparent;
		}
	}
	
}

.cm-s-vindigo {
	font-family: 'JetBrains Mono';

	span.cm-meta { color: #808000; }
	span.cm-number { color: #4a7edf; }
	span.cm-keyword { line-height: 1em; font-weight: bold; color: #000080; }
	span.cm-atom { font-weight: bold; color: #000080; }
	span.cm-def { color: #000000; }
	span.cm-variable { color: black; }
	span.cm-variable-2 { color: black; }
	span.cm-variable-3, .cm-s-idea span.cm-type { color: black; }
	span.cm-property { color: black; }
	span.cm-operator { color: black; }
	span.cm-comment { color: #455696; }
	span.cm-string { color: #209dd6; }
	span.cm-string-2 { color: #4db149; }
	span.cm-qualifier { color: #7c7266; }
	span.cm-error { color: #FF0000; }
	span.cm-attribute { color: #e4bd3f; }
	span.cm-tag { color: #f3863e; }
	span.cm-link { color: #8b5cf6; }
	span.cm-builtin { color: #30a; }
	span.cm-bracket { color: #a34831; }

	.CodeMirror-matchingbracket {
		outline: 1px solid grey;
		color: black !important;
	}

	.CodeMirror-activeline-background {
		background: #FFFAE3;
	}
}
</style>