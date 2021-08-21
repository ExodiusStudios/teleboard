import { ISchemaProvider } from '../../http';
import { join } from "path";
import Query from './resolvers/query';
import Mutation from './resolvers/mutation';

/**
 * The project schema provides types for interacting
 * with projects, tasks, and views within.
 */
export class AdminSchema implements ISchemaProvider {

	public id = 'admin'

	public schema = join(__dirname, 'admin.graphql');

	public resolvers = {
		Query,
		Mutation
	}

}