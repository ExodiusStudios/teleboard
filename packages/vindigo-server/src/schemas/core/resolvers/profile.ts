import { GraphQLResolvers } from "../../../http";
import { User } from "../../../models/user";
import { composeSlug } from "../../../util/helpers";

export default {
	fullName: (profile) => {
		return profile.name;
	},
	firstName: (profile) => {
		return profile.name.split(' ')[0];
	},
	slug: (profile) => {
		return composeSlug(profile);
	},
	profileUrl: (profile) => {
		return '/profile/' + composeSlug(profile);
	}
} as GraphQLResolvers<User>;