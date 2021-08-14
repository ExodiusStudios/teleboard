<template>
	<div class="setting">
		<label v-html="$t('CREATE_NEW_PROJECT_NAME')" />
		<w-input
			v-model="projectName"
			class="mb-5"
		/>

		<label v-html="$t('CREATE_NEW_DESC')" />
		<w-textarea
			v-model="projectDesc"
			class="mb-5"
			rows="3"
		/>

		<label>Public access</label>
		<small>
			Setting your project to be publically accessible means everyone will be able to view it as <em>guest</em>
		</small>
		<w-switch
			v-model="projectPublic"
			class="mb-4"
		/>

		<div class="block">
			<w-button
				class="mx-0 mt-2"
				:loading="isSaving"
				@click="saveDetails"
			>
				{{ $t('GENERAL_SAVE') }}
				<w-icon class="ml-2">
					mdi mdi-content-save
				</w-icon>
			</w-button>
		</div>

		<hr class="my-5">

		<label>
			Archive project
		</label>
		<small>
			Archiving this project will lock it from further modifications and will hide it from the project listings. 
		</small>

		<w-button
			v-wave
			class="mx-0 mt-2 text-red-400"
			outline
			@click="deletionDialog = true"
		>
			Archive project
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
			<section-title icon="mdi mdi-delete" class="text-red-400 dark:text-red-400">
				Close project
			</section-title>

			<div class="my-4">
				<p class="text-dark mb-1">
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
		isSaving: false,

		projectName: '',
		projectDesc: '',
		projectPublic: false,

		deletionDialog: false,
		deletionActive: false
	}),

	created() {
		this.projectName = this.project.name;
		this.projectDesc = this.project.description;
		this.projectPublic = this.project.isPublic;
	},

	methods: {
		async saveDetails() {
			if(this.isSaving) return;
			this.isSaving = true;

			await api.query(SAVE_MUTATION, {
				id: this.project.id,
				details: {
					name: this.projectName,
					description: this.projectDesc,
					isPublic: this.projectPublic
				},
			});

			this.isSaving = false;

			this.$waveui.notify({
				message: this.$t('PROJECT_SETTINGS_GENERAL_SAVE_SUCCESS'),
				success: true
			});
		},
		async deleteProject() {
			this.deletionActive = true;

			await api.query(ARCHIVE_MUTATION, {
				id: this.project.id
			});

			this.$router.push('/');
		}
	}
});

const SAVE_MUTATION = gql`
	mutation ($id: Int!, $details: ProjectUpdate!) {
		updateProject(id: $id, details: $details) {
			id
		}
	}
`;

const ARCHIVE_MUTATION = gql`
	mutation ($id: Int!) {
		deleteProject(id: $id) {
			id
		}
	}
`;
</script>