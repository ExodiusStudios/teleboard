declare module 'graphql-list-fields' {
	import { GraphQLResolveInfo } from "graphql";

	export default function(info: GraphQLResolveInfo): string[];
}