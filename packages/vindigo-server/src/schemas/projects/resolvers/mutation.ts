import { InvalidArgumentError, MissingSessionError, NoPermissionError } from "../../../util/errors";

import { GraphQLResolvers } from "../../../http";
import { database } from "../../..";

export default {
	createProject: async (_, { details }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const name = details.name;
		const isPublic = details.public;
		const description = details.description;

		if(name.length > 32) {
			throw new InvalidArgumentError("Name cannot exceed 32 characters");
		}

		return await database.project.create({
			data: {
				name: name,
				isPublic: isPublic,
				createdAt: new Date(),
				lastModifiedAt: new Date(),
				description: description || '',
				creatorId: ctx.user.id,
				isVisible: true,
				isClosed: false,
				members: {
					create: {
						memberId: ctx.user.id,
						accessLevel: 'manager'
					}
				}
			}
		});
	},
	deleteProject: async (_, { id }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const project = await database.project.findFirst({
			where: {
				id: id,
				creator: ctx.user
			}
		});

		if(!project) {
			throw new NoPermissionError();
		}

		return await database.project.delete({
			where: {
				id: project.id
			}
		});
	}
} as GraphQLResolvers;