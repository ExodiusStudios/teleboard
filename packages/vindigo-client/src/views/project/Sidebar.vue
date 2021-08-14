<template>
	<nav class="sidebar">
		<div class="sidebar__inner">
			<div
				class="sidebar__highlight"
				:style="highlightStyle"
			/>
			<ol class="sidebar__container">
				<w-tooltip
					v-for="(item, index) in listItems"
					:key="index"
					class="sidebar__item"
					right
				>
					<template #activator="{ on }">
						<router-link
							:to="item.href"
							tag="li"
							@click="currentIndex = item.rank"
						>
							<div class="sidebar__item-inner" v-on="on">
								<img :src="item.icon" class="w-7 h-7">
							</div>
						</router-link>
					</template>
					{{ $t(item.name) }}
				</w-tooltip>
			</ol>
		</div>
	</nav>
</template>

<script lang="ts">
import Vue from "vue";
import { routing } from '../../index';
import _ from "lodash";

export default Vue.extend({
	name: 'Sidebar',

	props: {
		project: {
			required: true,
			type: Object
		}
	},

	data: () => ({
		listItems: [] as any[],
		currentIndex: 0
	}),

	computed: {
		highlightStyle(): any {
			const hasOrder = this.$route.meta?.order !== undefined;

			return hasOrder ? {
				top: (this.$route.meta!.order * 56) + 'px',
				backgroundColor: this.project.accentColor
			} : {
				display: 'none'
			};
		}
	},
	
	mounted() {
		const route = routing.getRoute('Project Container')!;

		// initializing list items
		this.listItems = _.chain(route.children)
			.filter(child =>
				child.meta?.order !== undefined
			)
			.map(child => ({
				name: child.meta?.name,
				icon: child.meta?.icon,
				rank: child.meta?.order,
				href: child.path
			}))
			.orderBy(item => item.rank, 'asc')
			.value();

		// set the current default index
		this.currentIndex = this.$route.meta?.order;
	}
});
</script>

<style lang="postcss">
.sidebar {
	@apply w-14 bg-light-4 dark:bg-dark-4;

	&__inner {
		@apply sticky top-0;
	}

	&__highlight {
		@apply rounded-r-lg absolute left-0 h-14 w-1 z-10 transition-all;
	}

	&__item {
		@apply cursor-pointer transition-colors hover:bg-light-5 dark:hover:bg-dark-5;

		&:first-child {
			@apply bg-light-5 dark:bg-dark-5;

			img {
				@apply transition-transform;
			}

			&:hover img {
				@apply transform scale-110;
			}
		}
	}

	&__item-inner {
		@apply py-1 w-14 h-14 flex items-center justify-center;
	}

}
</style>