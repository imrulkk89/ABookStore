'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublishingYearSchema extends Schema {
  up () {
    this.create('publishing_years', (table) => {
      table.increments()
      table.string('name', 100)
      table.integer('total_books').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('publishing_years')
  }
}

module.exports = PublishingYearSchema
