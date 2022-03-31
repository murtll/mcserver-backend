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

export const selectPublicItems = async (category) => {
    const catId = (await db.get(`select id from categories where link='/${category}'`)).id
    return await db.all('SELECT id, name, picture, description, category_id, price, min_number, max_number FROM items where category_id = ?', [catId])
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

export const getPublicItemById = (id) => {
    return db.get('SELECT id, name, picture, description, category_id, price, min_number, max_number from items WHERE id = ?', id)
}

export const getItemById = (id) => {
    return db.get('SELECT * from items WHERE id = ?', id)
}

export const addDonateInfo = (donate, username, amount, date, payment_id, payment_price) => {
    return db.run('INSERT INTO donates (donater_username, donate_item_id, amount, date, payment_id, payment_price) VALUES (?, ?, ?, ?, ?, ?)', [username, donate, amount, date, payment_id, payment_price])
}

export const getLastDonates = () => {
    return db.all('SELECT donates.id as id, donater_username as donaterUsername, items.id as itemId, items.name as name, picture, price, categories.link, donates.amount as amount, date FROM donates INNER JOIN items on donates.donate_item_id = items.id INNER JOIN categories on items.category_id = categories.id ORDER BY donates.id DESC LIMIT 5')
}

export const getOnlineStats = () => {
	return db.all('SELECT number, time FROM online_stats ORDER BY time DESC LIMIT 10')
}

export const getLastStat = () => {
    return db.get('SELECT * FROM online_stats ORDER BY time DESC LIMIT 1')
}

export const updateStat = (id, number, time) => {
    return db.run('UPDATE online_stats SET number=?, time=? WHERE id=?', [number, time, id])
}

export const addOnlineStat = (number, time) => {
	return db.run('INSERT INTO online_stats (number, time) VALUES (?, ?)', [number, time])
}

export const checkIfPaymentExists = (paymentId) => {
	return db.get('SELECT * FROM donates where payment_id=? LIMIT 1', [paymentId])
}

export const getTopDonaters = () => {
	return db.all('SELECT donater_username, sum(payment_price) FROM donates GROUP BY donater_username ORDER BY sum(payment_price) DESC')
}

export const getPromo = (promo) => {
	return db.get('SELECT * FROM promos WHERE name=UPPER(?)', [promo])
}

export const addPromo = (promo) => {
	return db.run('INSERT INTO promos (name, multiplier) VALUES (?, ?)', [promo.name, promo.multiplier])
}

export const deletePromo = (promo) => {
	return db.run('DELETE FROM promos where id=?', [promo.id])
}
