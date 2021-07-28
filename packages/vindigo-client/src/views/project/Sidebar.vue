<template>
	<nav class="sidebar relative w-14">
		<div
			class="sidebar__highlight rounded-r-lg absolute left-0 h-14 w-1 z-10 transition-all bg-[#14A7F4]"
			:style="offsetActiveRoute"
		/>
		<ol class="sidebar__container">
			<router-link
				v-for="(item, index) in listItems"
				:key="index"
				:to="item.href"
			>
				<li
					class="sidebar__item py-1 w-14 h-14 flex items-center justify-center cursor-pointer hover:bg-[#293238]"
					@click="currentIndex = item.rank"
				>
					<w-icon xl class="text-white">
						mdi {{ item.icon }}
					</w-icon>
				</li>
			</router-link>
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