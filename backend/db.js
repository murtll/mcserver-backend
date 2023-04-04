import Knex from 'knex'
import knexConfig from '../knexfile.js'
import pg from 'pg'

pg.types.setTypeParser(pg.types.builtins.INT8, (value) => {
   return parseInt(value);
});

pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value) => {
    return parseFloat(value);
});

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => {
    return parseFloat(value);
});

const env = process.env.NODE_ENV || 'development'

const db = Knex(knexConfig[env])

const getCatIdByLink = async (link) => {
    return (await db('categories').first('id').where({ link: link })).id
}

export const selectItems = async (category) => {
    return await db('items').where({ category_id: await getCatIdByLink(`/${category}`) })
}

export const selectPublicItems = async (category) => {
    return await db('items').select('id', 'name', 'picture', 'description', 'category_id', 'price', 'min_number', 'max_number').where({ category_id: await getCatIdByLink(`/${category}`) })
}

export const selectCategories = () => {
    return db('categories')
}

export const addItem = (item) => {
    return db('items').insert({
        picture: item.picture,
        name: item.name, 
        description: item.description, 
        category_id: getCatIdByLink(`/${item.category}`), 
        price: item.price, 
        command: item.command
    })
}

export const deleteItem = (item) => {
    return db('items').delete().where({ id: item.id })
}

export const updateItem = (item) => {
    const updated = db('items').update(item, ['*']).where({ id: item.id })
    console.log(updated)
    return updated
}

export const addCategory = (category) => {
    return db('categories').insert(category)
}

export const deleteCategory = (category) => {
    return db('categories').delete().where({ id: category.id })
}

export const updateCategory = (category) => {
    const updated = db('categories').update(category, ['*']).where({ id: category.id })
    console.log(updated)
    return updated
}

export const getCategoryNameByItemId = async (id) => {
    const catId = (await db('items').first('category_id').where({ id: id })).category_id
    return getCategoryNameById(catId)
}

export const getCategoryNameById = async (id) => {
    return (await db('categories').first('link').where({ id: id })).link.substring(1)
}

export const getPublicItemById = (id) => {
    return db('items').first('id', 'name', 'picture', 'description', 'category_id', 'price', 'min_number', 'max_number').where({ id: id })
}

export const getItemById = (id) => {
    return db('items').first().where({ id: id })
}

export const addDonateInfo = (donate, username, amount, date, payment_id, payment_price) => {
    return db('donates').insert({
        donater_username: username,
        donate_item_id: donate,
        amount: amount,
        date: date, 
        payment_id: payment_id, 
        payment_price: payment_price
    })
}

export const getLastDonates = () => {
    return db('donates')
        .select('donates.id as id', 'donater_username as donaterUsername', 'items.id as itemId', 'items.name as name', 'picture', 'price', 'categories.link', 'donates.amount as amount', 'date')
        .innerJoin('items', 'donates.donate_item_id', '=', 'items.id')
        .innerJoin('categories', 'items.category_id', '=', 'categories.id')
        .orderBy('donates.date', 'desc')
        .limit(5)
}

export const getOnlineStats = () => {
    return db('online_stats').select('number', 'time').orderBy('time', 'desc').limit(10)
}

export const getLastStat = () => {
    return db('online_stats').first().orderBy('time', 'desc')
}

export const updateStat = (id, number, time) => {
    return db('online_stats').update({ number: number, time: time }).where({ id: id })
}

export const addOnlineStat = (number, time) => {
    return db('online_stats').insert({ number: number, time: time })
}

export const checkIfPaymentExists = (paymentId) => {
    return db('donates').first().where({ payment_id: paymentId })
}

export const getTopDonaters = () => {
    return db('donates').select('donater_username', 'sum(payment_price)').groupBy('donater_username').orderBy('sum(payment_price)', 'desc')
}

export const getPromo = (promo) => {
    return db('promos').first().where(db.raw('UPPER(name)=UPPER(?)', [promo]))
}

export const getAllPromos = () => {
    return db('promos').select()
}

export const addPromo = (promo) => {
    return db('promos').insert({ name: promo.name.toUpperCase(), multiplier: promo.multiplier })
}

export const deletePromo = (promo) => {
	return db('promos').delete().where({ id: promo.id })
}
