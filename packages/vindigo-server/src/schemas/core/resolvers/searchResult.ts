import { GraphQLResolvers } from "../../../http";
import { Like } from "typeorm";
import { SearchRequest } from "./query";
import { User } from "../../../models/user";

export default {
	users: async (request) => {
		return await User.find({
			where: { 
				name: Like(`%${request.query}%`) 
			}
		});
	}
} as GraphQLResolvers<SearchRequest>; 