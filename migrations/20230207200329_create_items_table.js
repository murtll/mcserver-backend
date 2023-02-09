/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('items', function(table) {
        table.increments('id').notNullable().primary()
        table.string('name').notNullable()
        table.string('picture').notNullable()
        table.string('description', 2048).notNullable().defaultTo('')
        table.integer('category_id').unsigned().notNullable().references('id').inTable('categories').onDelete('cascade')
        table.integer('price').unsigned().notNullable()
        table.string('command').notNullable()
        table.integer('max_number').unsigned().notNullable().defaultTo(1)
        table.integer('min_number').unsigned().notNullable().defaultTo(1)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('items')
}