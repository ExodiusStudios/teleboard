import { GraphQLResolvers } from "../../../http";
import { Team } from "../../../models/team";
import { composeSlug } from "../../../util/helpers";

export default {
	slug: async (team) => {
		return composeSlug(team);
	},
	teamUrl: async (team) => {
		return '/team/' + composeSlug(team);
	}
} as GraphQLResolvers<Team>;