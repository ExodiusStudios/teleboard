import { GraphQLResolvers } from "../../../http";
import { Project } from "@prisma/client";
import { composeSlug } from "../../../util/helpers";
import { database } from "../../..";

export default {
	slug: async (project) => {
		return composeSlug(project);
	},
	projectUrl: async (project) => {
		return '/project/' + composeSlug(project);
	},
	members: async (project) => {
		return database.projectMember.findMany({
			where: { project },
			include: {
				member: true
			}
		});
	},
	teams: async (project) => {
		return database.projectTeam.findMany({
			where: { project },
			include: {
				team: true
			}
		});
	}
} as GraphQLResolvers<Project>;