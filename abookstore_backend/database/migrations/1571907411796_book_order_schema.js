'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookOrderSchema extends Schema {
  up () {
    this.create('book_orders', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('set null')
      table.integer('order_id').unsigned().references('id').inTable('orders').onUpdate('CASCADE').onDelete('set null')
      table.integer('book_id').unsigned().references('id').inTable('books').onUpdate('CASCADE').onDelete('set null')
      table.integer('quantity')
      table.float('unit_price')
      table.timestamps()
    })
  }

  down () {
    this.drop('book_orders')
  }
}

module.exports = BookOrderSchema
