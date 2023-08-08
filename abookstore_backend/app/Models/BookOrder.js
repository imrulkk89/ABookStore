"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class BookOrder extends Model {
  static get table() {
    return "book_orders";
  }

  static get hidden() {
    return ["created_at", "updated_at"];
  }

  static get computed() {
    return ["quantity_price"];
  }

  getQuantityPrice({ quantity, unit_price }) {
    return quantity * unit_price;
  }

  book() {
    return this.belongsTo("App/Models/Book", "book_id", "id");
  }
}

module.exports = BookOrder;
