<template>
	<div>
		<label class="text-gray-500 mb-1 block text-sm">
			{{ $t("CREATE_NEW_PROJECT_NAME") }}
		</label>
		<w-input
			v-model="projectName"
			class="rounded-lg overflow-hidden"
			bg-color="gray-200"
			color="gray-700"
		/>

		<label class="text-gray-500 mb-1 mt-3 block text-sm">
			<div v-html="$t('CREATE_NEW_DESC')" />
		</label>
		<w-textarea
			v-model="projectDesc"
			class="rounded-lg overflow-hidden mb-3"
			bg-color="gray-200"
			color="gray-700"
			rows="3"
		/>

		<w-button
			v-wave
			class="mx-0 text-red-400"
			outline
			@click="deletionDialog = true"
		>
			Close project
			<w-icon class="pl-2">
				mdi mdi-delete
			</w-icon>
		</w-button>

		<!-- ANCHOR Deletion dialog -->
		<w-dialog
			v-model="deletionDialog"
			dialog-class="rounded-xl"
			width="350"
		>
			<section-title icon="mdi mdi-delete" class="text-red-400">
				Close project
			</section-title>

			<div class="my-4">
				<p class="mb-1">
					Are you sure you want to continue?
				</p>
				<small class="text-gray-500">
					Closing this project will lock it from further modifications
					and will no longer appear in projects lists.
				</small>
			</div>
			<div class="flex">
				<w-button
					v-wave
					class="mx-0"
					color="gray-700"
					text
					:disabled="deletionActive"
					@click="deletionDialog = false"
				>
					<w-icon class="pr-2">
						mdi mdi-arrow-left
					</w-icon>
					Back
				</w-button>
				<spacer />
				<w-button
					v-wave
					class="mx-0 text-red-400"
					bg-color="white"
					text
					:loading="deletionActive"
					@click="deleteProject"
				>
					Close
				</w-button>
			</div>
		</w-dialog>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { api } from '../../../..';
export default Vue.extend({
	name: 'GeneralTab',

	props: ['project'],

	data: () => ({
		projectName: '',
		projectDesc: '',

		deletionDialog: false,
		deletionActive: false
	}),

	created() {
		this.projectName = this.project.name;
		this.projectDesc = this.project.description;
	},

	methods: {
		async deleteProject() {
			this.deletionActive = true;

			await api.query(gql`
				mutation ($id: Int!) {
					deleteProject(id: $id) {
						id
					}
				}
			`, {
				id: this.project.id
			});

			this.$router.push('/');
		}
	}
});
</script>