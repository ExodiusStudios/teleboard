<template>
	<nav class="sidebar relative w-14">
		<div
			class="sidebar__highlight"
			:style="offsetActiveRoute"
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
	</nav>
</template>

<script lang="ts">
import Vue from "vue";
import { routing } from '../../index';
import _ from "lodash";

export default Vue.extend({
	name: 'Sidebar',

	data: () => ({
		listItems: [] as any[],
		currentIndex: 0
	}),

	computed: {
		offsetActiveRoute(): any {
			return {
				top: (this.$route.meta!.order * 56) + 'px'
			};
		}
	},
	
	mounted() {
		const route = routing.getRoute('Project Container')!;

		// initializing list items
		this.listItems = _.chain(route.children)
			.map((child) => ({
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

	&__highlight {
		@apply rounded-r-lg absolute left-0 h-14 w-1 z-10 transition-all bg-[#14A7F4];
	}

	&__item {
		@apply cursor-pointer transition-colors hover:bg-accent-5;

		&:first-child {
			@apply bg-accent-5;
		}
	}

	&__item-inner {
		@apply py-1 w-14 h-14 flex items-center justify-center;
	}

}
</style>