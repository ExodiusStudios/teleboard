import { GraphQLResolvers } from "../../../http";
import { Team } from "@prisma/client";
import { composeSlug } from "../../../util/helpers";
import { database } from "../../..";

export default {
	slug: async (team) => {
		return composeSlug(team);
	},
	teamUrl: async (team) => {
		return '/team/' + composeSlug(team);
	},
	members: async (team) => {
		const members = await database.teamMember.findMany({
			where: { team },
			include: {
				member: true
			}
		});

		return members.map(m => m.member);
	},
	projects: async (team) => {
		const projects = await database.projectTeam.findMany({
			where: { team },
			include: {
				project: true
			}
		});

		return projects.map(p => p.project);
	},
} as GraphQLResolvers<Team>;