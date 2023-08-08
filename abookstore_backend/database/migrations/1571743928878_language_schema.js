'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LanguageSchema extends Schema {
  up () {
    this.create('languages', (table) => {
      table.increments()
      table.string('name', 100)
      table.integer('total_books').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('languages')
  }
}

module.exports = LanguageSchema
