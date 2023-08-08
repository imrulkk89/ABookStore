"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use("Model");

class Book extends Model {
  static get hidden() {
    return ["created_at", "updated_at"];
  }

  getCoverImages(coverImages) {
    return JSON.parse(coverImages);
  }

  getBookFiles(book_files) {
    return JSON.parse(book_files);
  }

  book_author() {
    return this.belongsTo("App/Models/Author", "author", "id");
  }

  book_category() {
    return this.belongsTo("App/Models/Category", "category", "id");
  }

  book_discipline() {
    return this.belongsTo("App/Models/Discipline", "discipline", "id");
  }

  book_language() {
    return this.belongsTo("App/Models/Language", "language", "id");
  }

  book_publisher() {
    return this.belongsTo("App/Models/Publisher", "publisher", "id");
  }

  book_publishing_year() {
    return this.belongsTo("App/Models/PublishingYear", "publishing_year", "id");
  }

  book_stage() {
    return this.belongsTo("App/Models/Stage", "stage", "id");
  }

  book_review() {
    return this.hasMany("App/Models/Review", "id", "book_id");
  }

  book_favorite() {
    return this.hasMany("App/Models/Favorite", "id", "book_id");
  }

  book_order() {
    return this.hasMany("App/Models/BookOrder", "id", "book_id");
  }
}

module.exports = Book;
