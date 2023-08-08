'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  static get hidden() {
    return ["created_at", "updated_at"];
  }
 
  user() {
    return this.belongsTo('App/Models/User','id','category_id')
  }

  books() {
    return this.hasMany("App/Models/Book", "id", "category");
  }
  stage() {
    return this.hasMany("App/Models/Stage", "id", "category_id");
  }
  
}

module.exports = Category
