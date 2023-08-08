'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReviewSchema extends Schema {
  up () {
    this.create('reviews', (table) => {
      table.increments()
      table.integer('book_id').unsigned().references('id').inTable('books').onUpdate('CASCADE').onDelete('set null')
      table.integer('reviewer_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('set null')
      table.string('reviewer_name', 100)
      table.string('reviewer_email', 255)
      table.float('reviewer_rating')
      table.text('comment', 'mediumtext')
      table.datetime('review_date')
      table.timestamps()
    })
  }

  down () {
    this.drop('reviews')
  }
}

module.exports = ReviewSchema
