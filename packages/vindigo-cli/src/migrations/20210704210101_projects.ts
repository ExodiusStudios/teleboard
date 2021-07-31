import { Knex } from 'knex';

exports.up = async function({schema}: Knex) {
	return schema
	
		// ANCHOR Project table
		.createTable('projects', (table) => {
			table.increments();
			table.string('name');
			table.text('description');
			table.text('cover_image');
			table.text('background_image');
			table.boolean('is_visible');
			table.boolean('is_closed');
			table.boolean('is_public');
			table.timestamp('created_at');
			table.timestamp('last_modified_at');

			table.integer('creator_id')
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
			table.text('logo_image');
			table.timestamp('created_at');

			table.integer('creator_id')
				.unsigned()
				.notNullable()
				.references('users.id')
				.onDelete('CASCADE');
		})

		// ANCHOR Tasks table
		.createTable('tasks', (table) => {
			table.increments();
			table.timestamp('created_at');
			table.timestamp('last_modified_at');
			table.string('summary');
			table.text('description');
		})

		// ANCHOR Project invited teams table
		.createTable('project_teams', (table) => {
			table.increments();

			table.integer('team_id')
				.unsigned()
				.notNullable()
				.references('teams.id')
				.onDelete('CASCADE');
			
			table.integer('project_id')
				.unsigned()
				.notNullable()
				.references('projects.id')
				.onDelete('CASCADE');
			
			table.string('access_level');
		})

		// ANCHOR Project invited members table
		.createTable('project_members', (table) => {
			table.increments();
			
			table.integer('user_id')
				.unsigned()
				.notNullable()
				.references('users.id')
				.onDelete('CASCADE');
			
			table.integer('project_id')
				.unsigned()
				.notNullable()
				.references('projects.id')
				.onDelete('CASCADE');
			
			table.string('access_level');
		})

		// ANCHOR Parent-child task join table
		.createTable('child_tasks', (table) => {
			table.integer('parent_id')
				.unsigned()
				.notNullable()
				.references('tasks.id')
				.onDelete('CASCADE');
			
			table.integer('child_id')
				.unsigned()
				.notNullable()
				.references('tasks.id')
				.onDelete('CASCADE');
		})

		// ANCHOR Team member join table
		.createTable('team_members', (table) => {
			table.integer('user_id')
				.unsigned()
				.notNullable()
				.references('users.id')
				.onDelete('CASCADE');
			
			table.integer('team_id')
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
		.dropTable('child_tasks')
		.dropTable('teams')
		.dropTable('tasks')
		.dropTable('projects');
};