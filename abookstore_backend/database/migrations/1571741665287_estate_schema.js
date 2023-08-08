'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EstateSchema extends Schema {
  up () {
    this.create('estates', (table) => {
      table.increments()
      table.string('name', 100)
      table.datetime('arrival_duration').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('estates')
  }
}

module.exports = EstateSchema
