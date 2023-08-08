'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Stage extends Model {

  static get hidden() {
    return ['created_at', 'updated_at']
  }

  static async updateBookCount(id){
    await this.query()
          .where('id', id)
          .increment('total_books', 1)
  }

  static async decreaseBookCount(id) {
    await this.query()
      .where('id', id)
      .decrement('total_books', 1)
  }
  category() {
   return  this.belongsTo("App/Models/Category", "category_id", "id");
  }

  books(){
    return this.hasMany('App/Models/Book', 'id', 'stage')
  }
}

module.exports = Stage
