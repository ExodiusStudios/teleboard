import { MissingSessionError, NotImplementedError } from "../../../util/errors";

import { FindConditions } from "typeorm";
import { GraphQLResolvers } from "../../../http";
import { Project } from "../../../models/project";
import { Task } from "../../../models/task";
import { getProjectRelations } from "../fetchers/project";
import { parseTakeSize } from "../../../util/http";

export default {
	projects: async (_, { mode, skip, take }, ctx, info) => {
		let filter: FindConditions<Project>;

		switch(mode) {
			case 'OWNING': {
				if(!ctx.user) {
					throw new MissingSessionError();
				}

				filter = {
					creatorId: ctx.user.id
				};

				break;
			}
			case 'ACCESS': {
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
			take: parseTakeSize(take, 50),
			relations: getProjectRelations(info)
		});
	},
	project: async (_, { id }, _ctx, info) => {
		const ret = await Project.findOne(id, {
			relations: getProjectRelations(info)
		});

		return ret;
	},
	task: async (_, { id }) => {
		return Task.findOne(id);
	}
} as GraphQLResolvers;