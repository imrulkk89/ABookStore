'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DisciplineSchema extends Schema {
  up () {
    this.create('disciplines', (table) => {
      table.increments()
      table.string('name', 100)
      table.integer('total_books').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('disciplines')
  }
}

module.exports = DisciplineSchema
