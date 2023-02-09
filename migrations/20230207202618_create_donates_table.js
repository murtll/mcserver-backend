/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('donates', function(table) {
        table.increments('id').notNullable().primary()
        table.string('donater_username').notNullable()
        table.integer('donate_item_id').unsigned().notNullable().references('id').inTable('items').onDelete('cascade')
        table.integer('amount').unsigned().notNullable().defaultTo(1)
        table.bigint('date').unsigned().notNullable()
        table.string('payment_id')
        table.integer('payment_price').unsigned()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('donates')
}