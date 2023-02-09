/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('categories').insert([
    {id: 1, name: 'Кейсы', link: '/cases'},
    {id: 2, name: 'Привилегии', link: '/privileges'},
    {id: 3, name: 'Гемы', link: '/money'},
    {id: 4, name: 'Особое', link: '/special'},
  ]);
}
