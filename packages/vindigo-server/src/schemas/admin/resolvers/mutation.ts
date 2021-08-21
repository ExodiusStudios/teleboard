import { Prisma } from "@prisma/client";
import { database, logger } from "../../..";
import { GraphQLResolvers } from "../../../http";
import { ApiError } from "../../../util/errors";
import { buildProfileUpdate, registerNewProfile } from "../../../util/profile";
import { fetchProfileByEmail } from "../../core/fetchers/profile";

export default {
	setMaintenance: async (_, { enabled }) => {
		logger.info('Setting maintenance to ' + enabled);
		// TODO Implement maintenance toggle
		return true;
	},
	createUser: async (_, { details, verify }) => {
		const existing = await fetchProfileByEmail(details.email);

		if(existing) {
			throw new ApiError('email-exists');
		}

		return registerNewProfile(
			details.email,
			details.fullname,
			details.password,
			verify
		);
	},
	updateUserById: async (_, { id, details }) => {
		let update: Prisma.UserUpdateInput = {};

		if(details.profile) {
			update = { ...buildProfileUpdate(details.profile) };
		}

		if(details.verified !== undefined) {
			update.isVerified = details.verified;
		}

		if(details.enabled !== undefined) {
			update.isEnabled = details.enabled;
		}

		return database.user.update({
			where: {
				id: id
			},
			data: update
		});
	}
} as GraphQLResolvers;