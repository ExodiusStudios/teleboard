<template>
	<section v-if="profile" class="profile-page">
		<toolbar class="pl-0" />
		<section class="bg-white pb-10 dark:bg-dark">
			<div class="container container--thin flex items-center">
				<div class="flex items-center py-10">
					<avatar
						class="mr-4"
						:profile="profile"
						:size="'80px'"
					/>
					<div class="profile-page__profile-details">
						<h1 class="block font-extrabold text-2xl">
							{{ profile.fullName }} 
							<img 
								v-if="profile.role == 'admin'" 
								class="verified"
								:src="require('/src/assets/icon.svg')"
							>
						</h1>
						<p>{{ '@' + profile.username }} </p>
					</div>
				</div>
			</div>
			<section class="info">
				<div class="bio">
					About me: This is a bio :D
				</div>

				<div class="location">
					Location: The Netherlands
				</div>

				<div class="website">
					Website: exodius.studio
				</div>

				<div class="join-date">
					Member Since: {{ Date(profile.createdAt) }}
				</div>
			</section>
		</section>
		
		<main class="mt-[-60px]" role="main">
			<section class="container container--thin">
				<w-tabs
					:items="profileTabs"
					:transition="false"
					:fill-bar="true"
					active-class="accent-1"
					slider-color="accent-1"
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
import Avatar from "../../components/Avatar.vue";
import ContributionsTab from "./tabs/ContributionsTab.vue";
import TeamsTab from "./tabs/TeamsTab.vue";
import PostsTab from "./tabs/PostsTab.vue";
import { parseSlug, updateTitle } from "../../util";
import { api } from "../..";
import gql from "graphql-tag";
import { profileFragment } from "../../fragments";
import { NavigationGuardNext, Route } from "vue-router";

export default Vue.extend({
	name: "VindigoSettings",
	components: { Avatar },

	async beforeRouteEnter(to, _from, next) {
		const data = await fetchPageData(to, next);

		next((vm: any) => {
			vm.init(data);
		});
	},

	async beforeRouteUpdate(to, _from, next) {
		this.init(await fetchPageData(to, next));
		next();
	},
	
	data: () => ({
		profile: undefined as any
	}),

	computed: {
		profileTabs() {
			return [
				{ 
					title: "Posts", 
					content: PostsTab
				},
				{
					title: "Teams",
					content: TeamsTab,
				},
				{ 
					title: "Contributions", 
					content: ContributionsTab 
				},
			];
		}
	},

	mounted() {
		if(!this.profile) {
			this.$router.go(0); // HMR Fix
		}
	},

	methods: {
		init(profile: any) {
			this.profile = profile;

			updateTitle(`${this.profile.fullName}'s Profile`);
		}
	}
});

/**
 * Fetch page data for later assignment
 */
async function fetchPageData(to: Route, next: NavigationGuardNext<Vue>): Promise<any> {
	const uid = parseSlug(to.params.user);

	// Redirect to home on malformed slug
	if(uid == undefined) {
		next('/');
		return;
	}
	
	// Fetch the profile details
	const response = await api.query(gql`
		query ($uid: Int!) {
			profileById(id: $uid) {
				...AllProfileFields
			}
		}
		${profileFragment}
	`, {
		uid: uid
	});

	const profile = response.profileById;

	// Redirect to home on unknown profile
	if(!profile) {
		next('/');
		return;
	}

	return profile;
}
</script>

<style lang="postcss">
.profile-page {
	main {
		@apply pt-5;
	}

	.verified {
		display: inline;
		width: 20px;
		height: 20px;
		-webkit-user-drag: none;
		user-drag: none;
		user-select: none;
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