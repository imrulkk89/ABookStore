'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorySchema extends Schema {
  up() {
    this.create('categories', (table) => {
      table.increments()
      table.string('category').notNullable()
      table.string('image').notNullable()
      table.string('description').defaultTo('N/A')
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamps()
    })
  }

  down() {
    this.drop('categories')
  }
}

module.exports = CategorySchema
