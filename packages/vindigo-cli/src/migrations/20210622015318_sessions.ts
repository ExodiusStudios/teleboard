import { Knex } from 'knex';

exports.up = async function({schema}: Knex) {
	return schema.createTable('sessions', (table) => {
		table.string('id').primary();
		table.string('sid').unique();
		table.text('data');
		table.dateTime('expiresAt');
	});
};

exports.down = async function({schema}: Knex) {
	return schema.dropTable('sessions');
};