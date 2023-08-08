'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Discipline extends Model {
  static get hidden() {
    return ["created_at", "updated_at"];
  }

  static async add(name) {
    const entity = await this.findOrCreate(
      { name: String(name).trim() },
      { name: name, total_books: 0 }
    );

    return entity.id;
  }

  static async updateBookCount(id) {
    await this.query()
      .where("id", id)
      .increment("total_books", 1);
  }

  static async decreaseBookCount(id) {
    await this.query()
      .where("id", id)
      .decrement("total_books", 1);
  }

  books() {
    return this.hasMany("App/Models/Book", "id", "discipline");
  }
  // category() {
  //   return this.belongsTo("App/Models/Category", "category_id", "id");
  // }
}

module.exports = Discipline
