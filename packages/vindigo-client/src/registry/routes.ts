import AdminHome from '../views/admin/AdminHome.vue';
import ExplorerPage from '../views/explorer/ExplorerPage.vue';
import HomePage from '../views/home/HomePage.vue';
import KanbanPage from '../views/project/kanban/KanbanOverview.vue';
import OverviewPage from '../views/project/overview/ProjectOverview.vue';
import ProfilePage from '../views/profile/ProfilePage.vue';
import ProjectPage from '../views/project/ProjectPage.vue';
import ProjectSettingsPage from '../views/project/settings/ProjectSettings.vue';
import SettingsPage from '../views/settings/Settings.vue';
import TasksPage from '../views/project/tasks/TasksOverview.vue';
import Authenticate from '../views/authenticate/Authenticate.vue';
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
		path: '/authenticate',
		name: 'Authenticate',
		component: Authenticate,
		meta: {
			title: 'Authenticate'
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
		path: '/admin',
		name: 'Admin Dashboard',
		component: AdminHome,
		meta: {
			title: 'Admin Dashboard'
		}
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
					description: 'TOOLBAR_CREATE_TASK_DESC',
					handler: 'createTask'
				}
			]
		},
		children: [
			{
				path: 'settings',
				name: 'Settings',
				component: ProjectSettingsPage,
				meta: {
					name: 'VIEW_SETTINGS',
				}
			},
			{
				path: 'home',
				name: 'Home',
				redirect: '/',
				meta: {
					name: 'VIEW_HOME',
					icon: require('/assets/sidebar/home.svg'),
					order: 0
				}
			},
			{
				path: 'overview',
				name: 'Project Overview',
				component: OverviewPage,
				meta: {
					name: 'VIEW_OVERVIEW',
					icon: require('/assets/sidebar/overview.svg'),
					order: 1
				}
			},
			{
				path: 'tasks',
				name: 'Tasks View',
				component: TasksPage,
				meta: {
					name: 'VIEW_TASKS',
					icon: require('/assets/sidebar/tasks.svg'),
					order: 2
				}
			},
			{
				path: 'kanban',
				name: 'Kanban View',
				component: KanbanPage,
				meta: {
					name: 'VIEW_KANBAN',
					icon: require('/assets/sidebar/kanban.svg'),
					order: 3,
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
					icon: require('/assets/sidebar/calendar.svg'),
					order: 4
				}
			},
			{
				path: 'whiteboard',
				name: 'Whiteboard View',
				component: undefined,
				meta: {
					name: 'VIEW_WHITEBOARD',
					icon: require('/assets/sidebar/whiteboard.svg'),
					order: 5
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