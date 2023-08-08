'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaymentSchema extends Schema {
  up () {
    this.create('payments', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('set null')
      table.enu('payment_type', ['CASH', 'PAYPAL', 'VISA', 'MPESA'])
      table.string('card_number')
      table.integer('mm')
      table.integer('yy')
      table.integer('ccv')
      table.timestamps()
    })
  }

  down () {
    this.drop('payments')
  }
}

module.exports = PaymentSchema
