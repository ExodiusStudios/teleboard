import ExplorerPage from '../views/explorer/ExplorerPage.vue';
import HomePage from '../views/home/HomePage.vue';
import KanbanPage from '../views/project/kanban/KanbanOverview.vue';
import ProfilePage from '../views/profile/ProfilePage.vue';
import OverviewPage from '../views/project/overview/ProjectOverview.vue';
import ProjectPage from '../views/project/ProjectPage.vue';
import SettingsPage from '../views/settings/Settings.vue';
import TasksPage from '../views/project/tasks/TasksOverview.vue';
import { routing } from "..";

/**
 * Register all routing endpoints
 */
export function registerRoutes() {

	routing.defineRoute({
		path: '/',
		name: 'Homepage',
		component: HomePage,
		meta: {
			title: ''
		}
	});

	routing.defineRoute({
		path: '/explorer',
		name: 'Project Explorer',
		component: ExplorerPage,
		meta: {
			title: 'Project Explorer'
		}
	});

	routing.defineRoute({
		path: '/profile/:user',
		name: 'Profile',
		component: ProfilePage
	});
	
	routing.defineRoute({
		path: '/team/:team',
		name: 'Team Overview',
		component: undefined
	});

	routing.defineRoute({
		path: '/projects',
		name: 'Project Overview',
		component: undefined
	});

	routing.defineRoute({
		path: '/teams',
		name: 'Teams Overview',
		component: undefined
	});

	routing.defineRoute({
		path: '/activity',
		name: 'Activity Overview',
		component: undefined
	});

	routing.defineRoute({
		path: '/help',
		name: 'Help Overview',
		component: undefined
	});

	routing.defineRoute({
		path: '/settings',
		name: 'Profile Settings',
		component: SettingsPage
	});

	routing.defineRoute({
		path: '/project/:project/',
		name: 'Project Container',
		component: ProjectPage,
		redirect: '/project/:project/overview',
		meta: {
			title: false,
			creation: [
				{
					icon: 'mdi mdi-text-box-check',
					title: 'TOOLBAR_CREATE_TASK',
					description: 'TOOLBAR_CREATE_DESC',
					handler: 'createTask'
				}
			]
		},
		children: [
			{
				path: 'overview',
				name: 'Project Overview',
				component: OverviewPage,
				meta: {
					name: 'VIEW_HOME',
					icon: 'mdi-home',
					order: 0
				}
			},
			{
				path: 'tasks',
				name: 'Tasks View',
				component: TasksPage,
				meta: {
					name: 'VIEW_TASKS',
					icon: 'mdi-format-list-bulleted-square',
					order: 1
				}
			},
			{
				path: 'kanban',
				name: 'Kanban View',
				component: KanbanPage,
				meta: {
					name: 'VIEW_KANBAN',
					icon: 'mdi-view-column',
					order: 2,
					creation: [
						{
							icon: 'mdi mdi-eye',
							title: 'Bruh',
							description: 'Moment',
							handler: 'test'
						}
					]
				}
			},
			{
				path: 'calendar',
				name: 'Calendar View',
				component: undefined,
				meta: {
					name: 'VIEW_CALENDAR',
					icon: 'mdi-calendar-blank',
					order: 3
				}
			},
			{
				path: 'whiteboard',
				name: 'Whiteboard View',
				component: undefined,
				meta: {
					name: 'VIEW_WHITEBOARD',
					icon: 'mdi-brush',
					order: 4
				}
			}
		]
	});

	// NOTE 404 error fallback page - Always keep as final route!
	routing.defineRoute({
		name: 'Not Found',
		path: '*',
		redirect: '/'
	});
	
}