'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Favorite extends Model {
  static get hidden() {
    return ['created_at', 'updated_at']
  }

  books(){
    return this.belongsTo('App/Models/Book', 'book_id', 'id')
  }
}

module.exports = Favorite
