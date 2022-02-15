import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import crypto from 'crypto'

var db = null

export const openDb = async () => {
    sqlite3.verbose()

    db = await open({
        filename: 'data/database.db',
        driver: sqlite3.Database
    })
}

export const selectItems = async (category) => {
    const catId = (await db.get(`select id from categories where link='/${category}'`)).id
    return await db.all('SELECT * FROM items where category_id = ?', [catId])
}

export const selectCategories = () => {
    return db.all('SELECT * FROM categories')
}

export const addItem = async (item) => {
    const catId = (await db.get(`select id from categories where link='/${item.category}'`)).id
    await db.run('INSERT INTO items (picture, name, description, category_id, price, command) values (?, ?, ?, ?, ?, ?)', [item.picture, item.name, item.description, catId, item.price, item.command])
}

export const deleteItem = (item) => {
    return db.run('DELETE from items where id = ?', [item.id])
}

export const updateItem = (item) => {
    let updates = Object.keys(item)
                    .filter((prop) => prop != 'id')
                    .map((prop) => {
                        if (typeof item[prop] === 'number')
                            return `${prop} = ${item[prop]}`
                        return `${prop} = '${item[prop]}'`
                    }).join(', ')

    console.log(updates);

    return db.run(`UPDATE items SET ${updates} where id = ?`, item.id)
}

export const addCategory = (category) => {
    return db.run('INSERT INTO categories (name, link) values (?, ?)', [category.name, category.link])
}

export const deleteCategory = (category) => {
    return db.run('DELETE from categories where id = ?', [category.id])
}

export const updateCategory = (category) => {
    let updates = Object.keys(category)
                    .filter((prop) => prop != 'id')
                    .map((prop) => {
                        if (typeof category[prop] === 'number')
                            return `${prop} = ${category[prop]}`
                        return `${prop} = '${category[prop]}'`
                    }).join(', ')

    console.log(updates);

    return db.run(`UPDATE categories SET ${updates} where id = ?`, category.id)
}

export const checkAuthKey = async (key) => {
    return crypto.createHash('sha256').update(key).digest('hex') === (await db.get('SELECT key FROM auth where id = 1')).key
}

export const getCategoryNameByItemId = async (id) => {
    const catId = (await db.get('SELECT category_id FROM items WHERE id = ?', id)).category_id
    return (await db.get('SELECT link FROM categories WHERE id = ?', catId)).link.substring(1)
}
export const getCategoryNameById = async (id) => {
    return (await db.get('SELECT link FROM categories WHERE id = ?', id)).link.substring(1)
}

export const getItemById = (id) => {
    return db.get('SELECT * from items WHERE id = ?', id)
}

export const addDonateInfo = (info) => {
    return db.run('INSERT INTO donates (donater_username, donate_item_id) VALUES (?, ?)', [info.donaterUsername, info.donateItemId])
}

export const getLastDonates = () => {
    return db.all('SELECT donates.id as id, donater_username as donaterUsername, items.name as name, picture, price, categories.link FROM donates INNER JOIN items on donates.donate_item_id = items.id INNER JOIN categories on items.category_id = categories.id ORDER BY donates.id DESC LIMIT 5')
}
