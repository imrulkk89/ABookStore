'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PromoCodeSchema extends Schema {
  up () {
    this.create('promo_codes', (table) => {
      table.increments('id')
      table.string('code')
      table.float("discount")
      table.float('upto')
      table.datetime('valid_till')     
      table.timestamps()
    })
  }

  down () {
    this.drop('promo_codes')
  }
}

module.exports = PromoCodeSchema
