<template>
	<div class="file-upload">
		<div class="file-upload__trigger">
			<slot name="activator" :on="handlers" />
		</div>
		<input
			ref="uploadInput"
			class="hidden"
			type="file"
			accept=".png,.jpg,.jpeg,.gif"
			@change="onFileChanged"
		>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Optional } from '../typings/types';

export default Vue.extend({
	name: 'FileUpload',

	data: () => ({
		fileData: null as Optional<File>,
	}),

	computed: {
		hasPreviewListener(): boolean {
			return this.$listeners && !!this.$listeners.preview;
		},
		handlers(): any {
			return {
				click: this.openPicker
			};
		}
	},

	methods: {
		openPicker() {
			(this.$refs.uploadInput as any).click();
		},
		onFileChanged(e: any) {
			this.fileData = e.target.files[0];
			this.$emit('input', this.fileData);

			if(this.hasPreviewListener) {
				let reader = new FileReader();

				reader.onload = (event: any) => {
					this.$emit('preview', event.target.result);
				};

				reader.readAsDataURL(this.fileData!);
			}
		}
	}
});
</script>