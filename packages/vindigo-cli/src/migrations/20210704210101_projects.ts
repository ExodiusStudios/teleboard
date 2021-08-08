import { Knex } from 'knex';

exports.up = async function({schema}: Knex) {
	return schema
	
		// ANCHOR Project table
		.createTable('projects', (table) => {
			table.increments();
			table.string('name');
			table.text('description');
			table.text('coverImage');
			table.text('backgroundImage');
			table.boolean('isVisible');
			table.boolean('isClosed');
			table.boolean('isPublic');
			table.timestamp('createdAt');
			table.timestamp('lastModifiedAt');

			table.integer('creatorId')
				.unsigned()
				.notNullable()
				.references('users.id')
				.onDelete('CASCADE');
		})

		// ANCHOR Teams table
		.createTable('teams', (table) => {
			table.increments();
			table.string('name');
			table.text('description');
			table.text('logoImage');
			table.timestamp('createdAt');

			table.integer('creatorId')
				.unsigned()
				.notNullable()
				.references('users.id')
				.onDelete('CASCADE');
		})

		// ANCHOR Tasks table
		.createTable('tasks', (table) => {
			table.increments();
			table.timestamp('createdAt');
			table.timestamp('lastModifiedAt');
			table.string('summary');
			table.text('description');

			table.integer('parentId')
				.unsigned()
				.references('tasks.id')
				.onDelete('SET NULL');
		})

		// ANCHOR Project invited teams table
		.createTable('project_teams', (table) => {
			table.increments();

			table.integer('teamId')
				.unsigned()
				.notNullable()
				.references('teams.id')
				.onDelete('CASCADE');
			
			table.integer('projectId')
				.unsigned()
				.notNullable()
				.references('projects.id')
				.onDelete('CASCADE');
			
			table.string('accessLevel');
		})

		// ANCHOR Project invited members table
		.createTable('project_members', (table) => {
			table.increments();
			
			table.integer('memberId')
				.unsigned()
				.notNullable()
				.references('users.id')
				.onDelete('CASCADE');
			
			table.integer('projectId')
				.unsigned()
				.notNullable()
				.references('projects.id')
				.onDelete('CASCADE');
			
			table.string('accessLevel');
		})

		// ANCHOR Team member join table
		.createTable('team_members', (table) => {
			table.increments();

			table.integer('memberId')
				.unsigned()
				.notNullable()
				.references('users.id')
				.onDelete('CASCADE');
			
			table.integer('teamId')
				.unsigned()
				.notNullable()
				.references('teams.id')
				.onDelete('CASCADE');
		});
};

exports.down = async function({schema}: Knex) {
	return schema
		.dropTable('team_members')
		.dropTable('project_members')
		.dropTable('project_teams')
		.dropTable('teams')
		.dropTable('tasks')
		.dropTable('projects');
};