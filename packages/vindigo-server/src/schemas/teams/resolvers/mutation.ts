import { InvalidArgumentError, MissingSessionError, NoPermissionError } from "../../../util/errors";

import { GraphQLResolvers } from "../../../http";
import { Team } from "../../../models/team";

export default {
	createTeam: async (_, { details }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const name = details.name;
		const description = details.description;

		if(name.length > 32) {
			throw new InvalidArgumentError("Name cannot exceed 32 characters");
		}

		const team = new Team();

		// Save project details
		team.name = name;
		team.createdAt = new Date();
		team.description = description || '';
		team.members = [ctx.user];
		
		return await team.save();
	},
	deleteTeam: async (_, { id }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const team = await Team.findOne({
			where: {
				id: id,
				creatorId: ctx.user.id
			}
		});

		if(!team) {
			throw new NoPermissionError();
		}

		await Team.remove(team);

		// See https://github.com/typeorm/typeorm/issues/4058
		team.id = id;
		
		return team;
	}
} as GraphQLResolvers;