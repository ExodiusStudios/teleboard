import { GraphQLResolvers } from "../../../http";
import { SearchRequest } from "../../core/resolvers/query";
import { database } from "../../..";

export default {
	teams: async (request) => {
		return database.team.findMany({
			where: {
				name: {
					contains: request.query
				}
			}
		});
	}
} as GraphQLResolvers<SearchRequest>;