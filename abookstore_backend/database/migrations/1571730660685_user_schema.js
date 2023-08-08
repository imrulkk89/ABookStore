'use strict'
const Schema = use('Schema')
class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE').onUpdate('CASCADE')
      table.enu('user_type', ['SUPER_ADMIN', 'ADMIN', 'MAINTAINER', 'USER'])
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).nullable()
      table.string('email', 254).notNullable()
      table.string('phone', 100)
      table.string('password', 100).notNullable()
      table.text("confirmToken")
      table.datetime('last_login').nullable()
      table.datetime("last_logout")
      table.boolean("isLogin").defaultTo(0);
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
