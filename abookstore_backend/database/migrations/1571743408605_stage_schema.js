'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StageSchema extends Schema {
  up () {
    this.create('stages', (table) => {
      table.increments()
      table.integer('category_id').unsigned().references('id').inTable('categories').onUpdate('CASCADE').onDelete('set null')
      table.string('stage', 100)
      table.integer('total_books').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('stages')
  }
}

module.exports = StageSchema
