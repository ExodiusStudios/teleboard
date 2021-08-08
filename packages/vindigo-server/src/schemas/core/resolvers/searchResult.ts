import { GraphQLResolvers } from "../../../http";
import { SearchRequest } from "./query";
import { database } from "../../..";

export default {
	users: async (request) => {
		return database.user.findMany({
			where: {
				name: {
					contains: request.query
				}
			}
		});
	}
} as GraphQLResolvers<SearchRequest>; 