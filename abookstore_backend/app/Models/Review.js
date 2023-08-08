'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Review extends Model {

  static get hidden() {
    return ['created_at', 'updated_at']
  }

  user(){
    return this.belongsTo('App/Models/User', 'reviewer_id', 'id')
  }

  book(){
    return this.belongsTo('App/Models/Book', 'book_id', 'id')
  }
}

module.exports = Review
