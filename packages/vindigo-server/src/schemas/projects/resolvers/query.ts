import { MissingSessionError, NotImplementedError } from "../../../util/errors";

import { FindConditions } from "typeorm";
import { GraphQLResolvers } from "../../../http";
import { Project } from "../../../models/project";
import { Task } from "../../../models/task";
import { parseTakeSize } from "../../../util/http";

export default {
	projects: async (_, { mode, skip, take }, ctx) => {
		let filter: FindConditions<Project>;

		switch(mode) {
			case 'PERSONAL': {
				if(!ctx.user) {
					throw new MissingSessionError();
				}

				filter = {
					creatorId: ctx.user.id
				};

				break;
			}
			case 'PUBLIC': {
				filter = {
					isPublic: true
				};
				break;
			}
			case 'STARRED': {
				throw new NotImplementedError();
			}
			default: {
				throw new Error('Unknown list mode');
			}
		}

		return await Project.find({
			where: filter,
			skip: skip,
			take: parseTakeSize(take, 50)
		});
	},
	project: async (_, { id }) => {
		return Project.findOne(id);
	},
	task: async (_, { id }) => {
		return Task.findOne(id);
	}
} as GraphQLResolvers;