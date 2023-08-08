"use strict";

const Book = use("App/Models/Book");
const BookOrder = use("App/Models/BookOrder");
const Order = use("App/Models/Order");

class DifferentProductController {
  async topDiscountProducts() {
    const data = await Book.query().orderBy("discount", "desc").fetch();
    return data;
  }
  async topDiscountProductsWithLimit() {
    const data = await Book.query()
      .orderBy("discount", "desc")
      /* .whereNotNull("discount") */
     /*  .limit(6) */
      .fetch();
    return data;
  }

  async topSaleProducts() {
    const data = await Book.query().with("book_order").fetch();
    data
      .toJSON()
      .sort(
        (item1, item2) => item1.book_order.length - item2.book_order.length
      );

    return data;
  }

  async topSaleProductsWithLimit() {
    const data = await Book.query().with("book_order").fetch();
    data
      .toJSON()
      .sort(
        (item1, item2) => item1.book_order.length - item2.book_order.length
      );

    const books = [];
    data.toJSON().map((item) => {
      if (item.book_order.length && books.length <= 6) {
        books.push(item);
      }
    });

    return books;
  }

  async topRecentSaleProducts() {
    const data = await BookOrder.query()
      .with("book")
      .orderBy("id", "desc")
      .fetch();

    let books = [];

    data.toJSON().map((item) => {
      let found = false;
      books.map((innerItem) => {
        if (item.book_id === innerItem.book_id) found = true;
      });

      if (!found) books.push(item);
    });

    return books;
  }
  async topRecentSaleProductsWithLimit() {
    const data = await BookOrder.query()
      .with("book")
      .orderBy("id", "desc")
      .limit(6)
      .fetch();

    let books = [];

    data.toJSON().map((item) => {
      let found = false;
      books.map((innerItem) => {
        if (item.book_id === innerItem.book_id) found = true;
      });

      if (!found) books.push(item);
    });

    return books;
  }
}

module.exports = DifferentProductController;
