<template>
	<div ref="container" class="markdown-editor" />
</template>

<script lang="ts">
import Vue from 'vue';
import createEditor, { Editor } from 'codemirror';

import 'codemirror/mode/gfm/gfm';

export default Vue.extend({
	name: 'MarkdownEditor',

	props: {
		value: String
	},

	data: () => ({
		editor: null as unknown as Editor,
		lastValue: '',
		keyMap: {
			"Ctrl-B": 'bold',
			"Ctrl-I": 'italicize',
			"Ctrl-'": 'blockquote',
			"Ctrl-Alt-L": 'orderedList',
			"Ctrl-L": 'unorderedList',
			"Ctrl-Alt-I": 'image',
			"Ctrl-H": 'hr',
			"Ctrl-K": 'link'
		},
	}),

	watch: {
		value(val) {
			if(val == this.lastValue) return;
			this.editor.setValue(val);
		}
	},

	mounted() {
		const container = this.$refs.container as HTMLElement;
		
		this.editor = createEditor(container, {
			value: this.value || '',
			mode: 'gfm',
			theme: 'vindigo',
			extraKeys: {
				"Ctrl-B": this.applyBold.bind(this),
				"Ctrl-I": this.applyItalicize.bind(this),
				"Ctrl-'": this.applyBlockquote.bind(this),
				"Ctrl-Alt-L": this.applyOrderedList.bind(this),
				"Ctrl-L": this.applyUnorderedList.bind(this),
				"Ctrl-Alt-I": this.applyImage.bind(this),
				"Ctrl-H": this.applyHorizontalRule.bind(this),
				"Ctrl-K": this.applyLink.bind(this)
			}
		});

		this.editor.on('change', (editor: Editor) => {
			const value = editor.getValue();

			this.lastValue = value;
			this.$emit('input', editor.getValue());
		});
	},

	methods: {

		insert(insertion: string) {
			let doc = this.editor.getDoc();
			let cursor = doc.getCursor();

			doc.replaceRange(insertion, { line: cursor.line, ch: cursor.ch });
		},

		// Inspired by https://github.com/gilbert/MirrorMark

		toggleAround(start: string, end: string) {
			let doc = this.editor.getDoc();
			let cursor = doc.getCursor();

			if (doc.somethingSelected()) {
				let selection = doc.getSelection();

				if(selection.startsWith(start) && selection.endsWith(end)) {
					doc.replaceSelection(selection.substring(start.length, selection.length - end.length), "around");
				} else {
					doc.replaceSelection(start + selection + end, "around");
				}
			} else {
				// If no selection then insert start and end args and set cursor position between the two.
				doc.replaceRange(start + end, { line: cursor.line, ch: cursor.ch });
				doc.setCursor({ line: cursor.line, ch: cursor.ch + start.length });
			}
		},

		toggleBefore(insertion: string) {
			let doc = this.editor.getDoc();
			let cursor = doc.getCursor();

			if (doc.somethingSelected()) {
				let selections = doc.listSelections();
				let remove: boolean|null = null;

				this.editor.operation(function() {
					selections.forEach(function(selection) {
						let pos = [selection.head.line, selection.anchor.line].sort();

						// Remove if the first text starts with it
						if(remove == null) {
							remove = doc.getLine(pos[0]).startsWith(insertion);
						}

						for (let i = pos[0]; i <= pos[1]; i++) {
							if(remove) {
								// Don't remove if we don't start with it
								if(doc.getLine(i).startsWith(insertion)) {
									doc.replaceRange("", { line: i, ch: 0 }, {line: i, ch: insertion.length});
								}
							} else {
								doc.replaceRange(insertion, { line: i, ch: 0 });
							}
						}
					});
				});
			} else {
				let line = cursor.line;

				if(doc.getLine(line).startsWith(insertion)) {
					doc.replaceRange("", { line: line, ch: 0 }, {line: line, ch: insertion.length});
				} else {
					doc.replaceRange(insertion, { line: line, ch: 0 });
				}
			}
		},

		applyBold() {
			this.toggleAround('**', '**');
		},

		applyItalicize() {
			this.toggleAround('*', '*');
		},

		applyStrikethrough() {
			this.toggleAround('~~', '~~');
		},

		applyCode() {
			this.toggleAround('```\r\n', '\r\n```');
		},

		applyBlockquote() {
			this.toggleBefore('> ');
		},

		applyOrderedList() {
			this.toggleBefore('1. ');
		},

		applyUnorderedList() {
			this.toggleBefore('* ');
		},

		applyImage() {
			this.toggleAround('![', '](http://)');
		},

		applyLink() {
			this.toggleAround('[', '](http://)');
		},

		applyHorizontalRule() {
			this.insert('---');
		}
	}
});
</script>

<style lang="postcss">
.markdown-editor {
	.toastui-editor-defaultUI {
		@apply border-none;
	}

	.toastui-editor-md-tab-container {
		display: none !important;
	}

}
</style>

<style lang="postcss">
.markdown-editor .CodeMirror {
	font-family: 'Rubik';

	.CodeMirror-lines {
		@apply p-3;
	}
}
</style>