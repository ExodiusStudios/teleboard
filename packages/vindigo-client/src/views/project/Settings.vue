<template>
	<w-dialog
		:value="value"
		dialog-class="rounded-xl"
		width="750"
		@input="$emit('input', $event)"
	>
		<section-title icon="mdi mdi-cog">
			Project Settings

			<w-tag
				class="ml-2 h-6"
				bg-color="accent-1"
				color="white"
			>
				{{ project.name }}
			</w-tag>
		</section-title>

		<div class="my-4">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, iste harum libero, esse repellendus non qui architecto vitae dolores ad quibusdam quisquam nemo quidem aliquid laborum veritatis? Cumque, modi illum.
		</div>

		<div class="my-4">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, iste harum libero, esse repellendus non qui architecto vitae dolores ad quibusdam quisquam nemo quidem aliquid laborum veritatis? Cumque, modi illum.
		</div>

		<div class="my-4">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, iste harum libero, esse repellendus non qui architecto vitae dolores ad quibusdam quisquam nemo quidem aliquid laborum veritatis? Cumque, modi illum.
		</div>

		<w-button
			v-wave
			class="mx-0 text-red-400"
			text
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
	</w-dialog>
</template>

<script lang="ts">
import { gql } from '@apollo/client/core';
import Vue from 'vue';
import { api } from '../..';

export default Vue.extend({
	name: 'ProjectSettings',

	props: ['value', 'project'],

	data: () => ({
		deletionDialog: false,
		deletionActive: false
	}),

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