'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up() {
    this.create('orders', (table) => {
      table.increments()
      table.string('order_code', 50)
      table.float('original_price');
      table.float('discount_price')
      table.integer('address_id').unsigned().references('id').inTable('addresses').onUpdate('CASCADE').onDelete('set null')
      table.integer('delivery_method').unsigned().references('id').inTable('delivery_methods').onUpdate('CASCADE').onDelete('set null')
      table.json('payment')
      table.integer('promo_id').unsigned().references('id').inTable('promo_codes').onUpdate('CASCADE').onDelete('set null')
      table.boolean('paid')
      table.enu('status', ['PENDING', 'APPROVED', 'DELIVERY', 'DELIVERED', 'REJECTED'])
      table.timestamps()
    })
  }

  down() {
    this.drop('orders')
  }
}

module.exports = OrderSchema
