'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeliveryMethodSchema extends Schema {
  up () {
    this.create('delivery_methods', (table) => {
      table.increments()
      table.string('delivery_name', 100)
      table.string('delivery_time', 100)
      table.float('price')
      table.timestamps()
    })
  }

  down () {
    this.drop('delivery_methods')
  }
}

module.exports = DeliveryMethodSchema
