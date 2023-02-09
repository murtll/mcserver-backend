/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('promos', function(table) {
        table.increments('id').notNullable().primary()
        table.string('name').notNullable()
        table.double('multiplier', 4, 2).notNullable()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('promos')
}