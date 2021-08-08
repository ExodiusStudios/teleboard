import { config, database } from "../../..";
import { fetchProfileById, fetchProfileByUsername } from "../fetchers/profile";

import { GraphQLResolvers } from "../../../http";
import { InvalidArgumentError } from "../../../util/errors";

export interface SearchRequest {
	query: string;
}

export default {
	config: async (_, _args) => {
		return {
			instanceName: config.general.name,
			maintenance: config.general.maintenance,
			allowRegister: config.authentication.registrations,
			allowAnonymous: config.authentication.anonymous_users
		};
	},
	profile: async (_, _args, ctx) => {
		const user = ctx.user;

		if(user) {
			database.user.update({
				where: {
					id: user.id
				},
				data: {
					lastSeenAt: new Date()
				}
			});
		}

		return user;
	},
	profileById: async (_, { id }) => {
		return fetchProfileById(id);
	},
	profileByName: async (_, { username }) => {
		return fetchProfileByUsername(username);
	},
	search: async (_, args) => {
		if(args.query.length < 3) {
			throw new InvalidArgumentError('Search query must be at least 3 characters');
		}

		return args;
	}
} as GraphQLResolvers;