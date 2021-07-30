import { GraphQLResolvers } from "../../../http";
import { Project } from "../../../models/project";
import { composeSlug } from "../../../util/helpers";

export default {
	slug: async (project) => {
		return composeSlug(project);
	},
	projectUrl: async (project) => {
		return '/project/' + composeSlug(project);
	}
} as GraphQLResolvers<Project>;