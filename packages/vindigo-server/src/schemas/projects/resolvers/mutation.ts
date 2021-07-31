import { InvalidArgumentError, MissingSessionError, NoPermissionError } from "../../../util/errors";

import { GraphQLResolvers } from "../../../http";
import { Project } from "../../../models/project";
import { ProjectMember } from "../../../models/projectMember";
import { logger } from "../../..";

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

		const project = new Project();
		const member = new ProjectMember();

		// Save project details
		project.name = name;
		project.isPublic = isPublic;
		project.createdAt = new Date();
		project.lastModifiedAt = new Date();
		project.description = description || '';
		project.creatorId = ctx.user.id;
		project.isVisible = true;
		project.isClosed = false;
		project.isPublic = isPublic;
		
		const created = await project.save();

		// Save owner member details
		member.project = created;
		member.user = ctx.user;
		member.accessLevel = 'manager';

		await member.save();
		
		return created;
	},
	deleteProject: async (_, { id }, ctx) => {
		if(!ctx.user) {
			throw new MissingSessionError();
		}

		const project = await Project.findOne({
			where: {
				id: id,
				creatorId: ctx.user.id
			}
		});

		if(!project) {
			throw new NoPermissionError();
		}

		await Project.remove(project);

		// See https://github.com/typeorm/typeorm/issues/4058
		project.id = id;
		
		return project;
	}
} as GraphQLResolvers;