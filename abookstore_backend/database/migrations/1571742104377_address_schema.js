'use strict'

const Schema = use('Schema')

class AddressSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('set null')
      table.integer('estate_id').unsigned().references('id').inTable('estates').onUpdate('CASCADE').onDelete('set null')
      table.string('first_name', 100)
      table.string('last_name', 100)
      table.string('estate', 100)
      table.string('country', 100)
      table.string('city', 100)
      table.string('address', 255)
      table.string('zip', 50)
      table.string('house_num', 255)
      table.string('phone', 100)
      table.string('email', 255)
      table.text('comments')
      table.timestamps()
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressSchema
