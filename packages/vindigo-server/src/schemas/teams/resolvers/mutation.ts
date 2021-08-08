import { InvalidArgumentError, MissingSessionError, NoPermissionError } from "../../../util/errors";

import { GraphQLResolvers } from "../../../http";
import { database } from "../../..";

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

		return database.team.create({
			data: {
				name: name,
				createdAt: new Date(),
				description: description || '',
				creatorId: ctx.user.id,
				members: {
					create: {
						member: {
							connect: ctx.user
						}
					}
				}
			}
		});
	},
	deleteTeam: async (_, { id }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const team = await database.team.findFirst({
			where: {
				id: id,
				creatorId: ctx.user.id
			}
		});

		if(!team) {
			throw new NoPermissionError();
		}

		return database.team.delete({
			where: {
				id: team.id
			}
		});
	}
} as GraphQLResolvers;