import { GraphQLResolvers } from "../../../http";
import { database } from "../../..";
import { parseTakeSize } from "../../../util/http";

export default {
	team: async (_, { id }, _ctx) => {
		return database.team.findUnique({
			where: { id }
		});
	},
	teams: async (_, { skip, take}, _ctx) => {
		return database.team.findMany({
			skip: skip,
			take: parseTakeSize(take, 50)
		});
	}
} as GraphQLResolvers;