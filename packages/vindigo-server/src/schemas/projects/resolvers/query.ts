import { MissingSessionError, NotImplementedError } from "../../../util/errors";

import { FindConditions } from "typeorm";
import { GraphQLResolvers } from "../../../http";
import { Like } from "typeorm";
import { Project } from "../../../models/project";
import { Task } from "../../../models/task";
import { Team } from "../../../models/team";
import { User } from "../../../models/user";
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
	}, 
	search: async(_, { query }) => {

		const search = { 
			name: Like(`%${query}%`) 
		};

		const projectTask = Project.find({
			where: search
		});

		const teamsTask = Team.find({
			where: search
		});

		const userTask = User.find({
			where: search
		});

		const [projects, teams, users] = await Promise.all([
			projectTask,
			teamsTask,
			userTask
		]);

		return { projects, teams, users };
	}	
} as GraphQLResolvers;