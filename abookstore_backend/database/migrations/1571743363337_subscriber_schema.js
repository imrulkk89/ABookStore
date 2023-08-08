'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscriberSchema extends Schema {
  up () {
    this.create('subscribers', (table) => {
      table.increments()
      table.enu('subscriber_type', ['GUST', 'USER'])
      table.integer('subscriber_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('set null')
      table.string('email', 255)
      table.boolean('announcement')
      table.boolean('sale_invitation')
      table.boolean('weekly_newsletter')
      table.boolean('unsubscribe')
      table.timestamps()
    })
  }

  down () {
    this.drop('subscribers')
  }
}

module.exports = SubscriberSchema
