/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('items').insert([
    {id: 25, name: 'Размут', category_id: '4', price: '399'},
  ]);
}
