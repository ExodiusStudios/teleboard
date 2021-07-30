import { ApiError, InvalidArgumentError } from "../../../util/errors";

import { GraphQLResolvers } from "../../../http";
import { User } from "../../../models/user";
import { config } from "../../..";

export interface SearchRequest {
	query: string;
}

export default {
	config: async (_, _args) => {
		return {
			instanceName: config.general.name,
			allowRegister: config.authentication.registrations,
			allowAnonymous: config.authentication.anonymous_users
		};
	},
	profile: async (_, _args, ctx) => {
		const user = ctx.user;

		if(user) {
			user.lastSeenAt = new Date();
			user.save();
		}

		// console.log(user);
		// console.log('avatar', user?.avatar);

		return user;
	},
	profileById: async (_, { id }) => {
		return User.findOne(id);
	},
	profileByName: async (_, { username }) => {
		return User.findOne({
			where: {
				username: username
			}
		});
	},
	search: async (_, args) => {
		if(args.query.length < 3) {
			throw new InvalidArgumentError('Search query must be at least 3 characters');
		}

		return args;
	}
} as GraphQLResolvers;