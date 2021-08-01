import { GraphQLResolvers } from "../../../http";
import { Team } from "../../../models/team";
import { getTeamRelations } from "../fetchers/team";
import { parseTakeSize } from "../../../util/http";

export default {
	team: async (_, { id }, _ctx, info) => {
		return Team.findOne(id, {
			relations: getTeamRelations(info)
		});
	},
	teams: async (_, { skip, take}, _ctx, info) => {
		return await Team.find({
			where: {
				
			},
			skip: skip,
			take: parseTakeSize(take, 50),
			relations: getTeamRelations(info)
		});
	}
} as GraphQLResolvers;