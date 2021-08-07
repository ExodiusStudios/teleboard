import { GraphQLResolvers } from "../../../http";
import { Team } from "../../../models/team";
import { composeSlug } from "../../../util/helpers";

export default {
	slug: async (team) => {
		return composeSlug(team);
	},
	teamUrl: async (team) => {
		return '/team/' + composeSlug(team);
	},
	members: async (team) => {
		const part = await Team.findOne({
			select: ['id'],
			relations: ['members'],
			where: {
				id: team.id
			}
		});

		return part?.members;
	},
	projects: async (team) => {
		const part = await Team.findOne({
			select: ['id'],
			relations: ['projects'],
			where: {
				id: team.id
			}
		});

		return part?.projects;
	},
} as GraphQLResolvers<Team>;