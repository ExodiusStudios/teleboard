import { InvalidArgumentError, MissingSessionError, NoPermissionError } from "../../../util/errors";

import { GraphQLResolvers } from "../../../http";
import { Prisma } from "@prisma/client";
import { database } from "../../..";
import { fetchProjecOfCreator } from "../fetchers/project";
import marked from "marked";

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
				accentColor: '#14A7F4',
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
	},
	updateProject: async (_, { id, details }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const project = await fetchProjecOfCreator(id, ctx.user);
		const mutation: Prisma.ProjectUpdateInput = {};

		if(!project) {
			throw new NoPermissionError();
		}

		if(details.name !== undefined) {
			if(!details.name.length) {
				throw new InvalidArgumentError('name cannot be empty');
			}

			mutation.name = details.name;
		}

		if(details.readme !== undefined) {
			if(details.readme.length) {
				mutation.readme = details.readme;
				mutation.readmeHtml = marked(details.readme);
			} else {
				mutation.readme = null;
				mutation.readmeHtml = null;
			}
		}

		if(details.isPublic !== undefined) {
			mutation.isPublic = details.isPublic;
		}

		if(details.description !== undefined) {
			mutation.description = details.description || null;
		}

		// TODO Delete the actual image from disk
		if(details.removeCover) {
			mutation.coverImage = null;
		}

		return await database.project.update({
			where: {
				id: project.id
			},
			data: mutation
		});
	}
} as GraphQLResolvers;