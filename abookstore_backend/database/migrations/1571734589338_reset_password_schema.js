'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ResetPasswordSchema extends Schema {
  up () {
    this.create('reset_passwords', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('verify_code', 100)
      table.datetime('resetPasswordExpire')
      table.timestamps()
    })
  }

  down () {
    this.drop('reset_passwords')
  }
}

module.exports = ResetPasswordSchema
