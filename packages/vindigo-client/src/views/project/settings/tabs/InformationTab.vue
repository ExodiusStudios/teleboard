<template>
	<section>
		<label>
			Project information
		</label>
		<p class="text-gray-500 mt-4">
			Provide context to your project by writing an information entry.
			You can use this to provide further explanation, list out useful links and resources, or to define task rules and conventions.
		</p>
		<p class="text-gray-500 mt-4">
			The project information supports full <a target="_blank" href="https://www.markdownguide.org/basic-syntax/">Markdown</a> support.
		</p>

		<markdown-editor
			v-model="information"
			class="info-editor mt-4"
		/>

		<div class="block mt-4">
			<w-button
				class="mx-0 mt-2"
				:loading="isSaving"
				@click="saveInformation"
			>
				{{ $t('GENERAL_SAVE') }}
				<w-icon class="ml-2">
					mdi mdi-content-save
				</w-icon>
			</w-button>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { api } from '../../../..';

export default Vue.extend({
	name: 'InformationTab',

	props: ['project'],

	data: () => ({
		information: '',
		isSaving: false
	}),

	created() {
		this.information = this.project.readme;
	},
	
	methods: {
		async saveInformation() {
			if(this.isSaving) return;
			this.isSaving = true;

			await api.query(SAVE_MUTATION, {
				id: this.project.id,
				details: {
					readme: this.information
				},
			});

			this.isSaving = false;

			this.$waveui.notify({
				message: this.$t('PROJECT_SETTINGS_SAVE_SUCCESS'),
				success: true
			});
		},
	}
});

const SAVE_MUTATION = gql`
	mutation ($id: Int!, $details: ProjectUpdate!) {
		updateProject(id: $id, details: $details) {
			id
		}
	}
`;
</script>

<style lang="postcss">
.info-editor .CodeMirror {
	@apply rounded-md ring-2 ring-light-2 !important;

	height: 400px;
}
</style>