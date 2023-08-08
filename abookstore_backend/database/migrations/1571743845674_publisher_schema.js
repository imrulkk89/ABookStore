'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublisherSchema extends Schema {
  up () {
    this.create('publishers', (table) => {
      table.increments()
      table.string('name', 100)
      table.integer('total_books').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('publishers')
  }
}

module.exports = PublisherSchema
