import { GraphQLResolvers } from "../../../http";
import { SearchRequest } from "../../core/resolvers/query";
import { database } from "../../..";

export default {
	projects: async (request) => {
		return database.project.findMany({
			where: { 
				name: {
					contains: request.query
				}
			}
		});
	}
} as GraphQLResolvers<SearchRequest>;