import { GraphQLResolvers } from "../../../http";
import { Team } from "../../../models/team";

export default {
	team: async (_, { id }) => {
		return Team.findOne(id);
	},
} as GraphQLResolvers;