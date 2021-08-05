<template>
	<section class="settings-page">
		<toolbar class="pl-0" />
		<section class="bg-white pb-10 dark:bg-gray-800">
			<div class="container container--thin flex items-center">
				<div class="flex items-center py-10">
					<avatar
						class="mr-4"
						:profile="$vuex.state.profile"
						:size="'80px'"
					/>
					<div class="settings-page__profile-details">
						<h1 class="block text-3xl">
							{{ $vuex.state.profile.fullName }}
						</h1>
						<p>{{ $t('SETTINGS_PROFILE_DESCRIPTION') }} </p>
					</div>
				</div>
				<spacer />
				<div>
					<w-button :route="profileUrl">
						{{ $t('SETTINGS_PROFILE_WATCH_PROFILE' ) }}
					</w-button>
				</div>
			</div>
		</section>
		<main class="mt-[-60px]" role="main">
			<section class="container container--thin">
				<w-tabs
					:items="settingTabs"
					:transition="false"
					:fill-bar="true"
					class="overflow-visible"
				>
					<template #item-content="{ item }">
						<section class="mt-5 p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
							<component
								:is="item.content"
							/>
						</section>
					</template>
				</w-tabs>
			</section>
		</main>
	</section>
</template>

<script lang="ts">
import Vue from "vue";
import AppearenceTab from "./tabs/AppearenceTab.vue";
import GeneralTab from "./tabs/GeneralTab.vue";
import PrivacyTab from "./tabs/PrivacyTab.vue";
import AccountTab from "./tabs/AccountTab.vue";
import Avatar from "../../components/Avatar.vue";

export default Vue.extend({
	name: "VindigoSettings",
	components: { Avatar },
	data: () => ({
		data: undefined
	}),
	computed: {
		settingTabs() {
			return [
				{ title: this.$t("SETTINGS_GENERAL"), content: GeneralTab },
				{
					title: this.$t("SETTINGS_APPEARANCE"),
					content: AppearenceTab,
				},
				{ title: this.$t("SETTINGS_PRIVACY"), content: PrivacyTab },
				{ title: this.$t("SETTINGS_ACCOUNT"), content: AccountTab },
			];
		},
		profileUrl(): string {
			return `/profile/${this.$vuex.state.profile!.id}`;
		}
	},
});
</script>

<style lang="postcss">
.settings-page {
	main {
		@apply pt-5;
	}

	.w-tabs {
		@apply border-none;

		&__content {
			@apply px-0;
		}

		&__content-wrap {
			@apply rounded-b-md;
		}
	}

	&__profile-details {
		h1, p {
			line-height: 28px;
		}
	}
}
</style>