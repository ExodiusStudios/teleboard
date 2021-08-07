import { GraphQLResolveInfo } from "graphql";
import { hasField } from "../../../util/helpers";

/**
 * Compute a list of relations to load based on
 * the given resolver info.
 * 
 * @param info Resolver info
 * @returns Relations
 */
export function getProjectRelations(info: GraphQLResolveInfo): string[] {
	const relations = [];

	if(hasField(info, 'members')) {
		relations.push('members');
	}

	if(hasField(info, 'teams')) {
		relations.push('teams');
	}

	return relations;
}