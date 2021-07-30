import { GraphQLResolvers } from "../../../http";
import { Like } from "typeorm";
import { Project } from "../../../models/project";
import { SearchRequest } from "../../core/resolvers/query";

export default {
	projects: async (request) => {
		return await Project.find({
			where: { 
				name: Like(`%${request.query}%`) 
			}
		});
	}
} as GraphQLResolvers<SearchRequest>;