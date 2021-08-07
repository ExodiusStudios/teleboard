import { GraphQLResolvers } from "../../../http";
import { Team } from "../../../models/team";
import { parseTakeSize } from "../../../util/http";

export default {
	team: async (_, { id }, _ctx) => {
		return Team.findOne(id);
	},
	teams: async (_, { skip, take}, _ctx) => {
		return await Team.find({
			skip: skip,
			take: parseTakeSize(take, 50)
		});
	}
} as GraphQLResolvers;