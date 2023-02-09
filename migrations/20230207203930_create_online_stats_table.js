/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('online_stats', function(table) {
        table.increments('id').notNullable().primary()
        table.bigint('time').unsigned().notNullable()
        table.integer('number').unsigned().notNullable()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('online_stats')
}