import { GraphQLResolveInfo } from "graphql";
import { hasField } from "../../../util/helpers";

/**
 * Compute a list of relations to load based on
 * the given resolver info.
 * 
 * @param info Resolver info
 * @returns Relations
 */
export function getTeamRelations(info: GraphQLResolveInfo): string[] {
	const relations = [];

	if(hasField(info, 'members.')) {
		relations.push('members');
	}

	if(hasField(info, 'projects.')) {
		relations.push('projects');
	}

	return relations;
}