import { GraphQLResolvers } from "../../../http";
import { Like } from "typeorm";
import { SearchRequest } from "../../core/resolvers/query";
import { Team } from "../../../models/team";

export default {
	teams: async (request) => {
		return await Team.find({
			where: { 
				name: Like(`%${request.query}%`) 
			}
		});
	}
} as GraphQLResolvers<SearchRequest>;