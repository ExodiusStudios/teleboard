import { GraphQLResolvers } from "../../../http";
import { Project } from "../../../models/project";
import { composeSlug } from "../../../util/helpers";

export default {
	slug: async (project) => {
		return composeSlug(project);
	},
	projectUrl: async (project) => {
		return '/project/' + composeSlug(project);
	},
	members: async (project) => {
		const part = await Project.findOne({
			select: ['id'],
			relations: ['members', 'members.member'],
			where: {
				id: project.id
			}
		});

		console.log('part = ', part);

		return part?.members;
	},
	teams: async (project) => {
		const part = await Project.findOne({
			select: ['id'],
			relations: ['teams', 'teams.team'],
			where: {
				id: project.id
			}
		});

		return part?.teams;
	}
} as GraphQLResolvers<Project>;