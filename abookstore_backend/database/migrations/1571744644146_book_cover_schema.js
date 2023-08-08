'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookCoverSchema extends Schema {
  up () {
    this.create('book_covers', (table) => {
      table.increments('id')
      table.string('name')
      table.integer("total_books")    
      table.timestamps()
    })
  }

  down () {
    this.drop('book_covers')
  }
}

module.exports = BookCoverSchema
