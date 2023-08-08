'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookSchema extends Schema {
  up() {
    this.create('books', (table) => {
      table.increments()
      table.string('name')
      table.json('cover_images') //{image_1: 'image1_url', image_2:'image2_url', image_3:'image3_url'}
      table.json('book_files').nullable()
      table.integer('page_number')
      table.text('short_description')
      table.text('long_description', 'longtext')
      table.float('rating')
      table.float('price')
      table.float('price_hardcover').nullable()
      table.float('price_audiobook').nullable()
      table.float('price_epub').nullable()
      table.float('price_pdf').nullable()
      table.float('sales_price_hardcover').nullable()
      table.float('sales_price_audiobook').nullable()
      table.float('sales_price_epub').nullable()
      table.float('sales_price_pdf').nullable()
      table.float('sales_price').nullable()
      table.float('discount')
      table.enu('discount_type', ['HARD_COVER', 'PDF', 'EPUB', 'AUDIO']).nullable()
      table.integer('stock')
      table.string('slug', 255)
      table.integer('status')
      table.string('tags')
      table.integer('book_cover').unsigned().references('id').inTable('book_covers').onUpdate('CASCADE').onDelete('set null').nullable()
      table.integer('promo_code').unsigned().references('id').inTable('promo_codes').onUpdate('CASCADE').onDelete('set null').nullable()
      table.integer('category').unsigned().references('id').inTable('categories').onUpdate('CASCADE').onDelete('set null')
      table.integer('stage').unsigned().references('id').inTable('stages').onUpdate('CASCADE').onDelete('set null')
      table.integer('discipline').unsigned().references('id').inTable('disciplines').onUpdate('CASCADE').onDelete('set null')
      table.integer('author').unsigned().references('id').inTable('authors').onUpdate('CASCADE').onDelete('set null')
      table.integer('publisher').unsigned().references('id').inTable('publishers').onUpdate('CASCADE').onDelete('set null')
      table.integer('publishing_year').unsigned().references('id').inTable('publishing_years').onUpdate('CASCADE').onDelete('set null')
      table.integer('language').unsigned().references('id').inTable('languages').onUpdate('CASCADE').onDelete('set null')
      table.boolean('isDeleted').defaultTo(0)
      table.timestamps()
    })
  }

  down() {
    this.drop('books')
  }
}

module.exports = BookSchema
