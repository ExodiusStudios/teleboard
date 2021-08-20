import { Knex } from 'knex';

exports.up = async ({ schema }: Knex) => {
	return schema.createTable('users', (table) => {
		table.increments();
		table.string('username');
		table.string('email');
		table.string('password');
		table.string('avatar');
		table.string('bio');
		table.string('name');
		table.string('role');
		table.string('website');
		table.string('language');
		table.timestamp('createdAt');
		table.timestamp('lastSeenAt');
		table.boolean('isEnabled').defaultTo(true);
		table.boolean('isVerified').defaultTo(false);
		table.string('verifyCode', 16);
	});
};
exports.down = async ({ schema }: Knex) => {
	return schema.dropTable('users');
};