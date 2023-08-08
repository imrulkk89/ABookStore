'use strict'
const User = use("App/Models/User");
const Book = use("App/Models/Book");
const Order = use("App/Models/Order")
const Database = use('Database')

class DashboardController {
  async index({ view, response }) {
    try {

      const totalBook = await Book.getCount('id');
      const totalOder = await Order.getCount('id');
      const activeUser = await User.query()
        .where("isLogin", true)
        .where("user_type", 'USER')
        .getCount("isLogin");
      const totalAmount = await Database.from("orders").sum("original_price as total");
      //    console.log(totalAmount, totalBook, totalOder, activeUser);
      return view.render("dashboard", {
        title: "Book E commerce Dashboard",
        totalAmount: totalAmount[0].total,
        total_book: totalBook,
        total_order: totalOder,
        activeUser: activeUser,
        dashboard: true
      });
    } catch (error) {
      console.log(error)
    }

  }
}

module.exports = DashboardController
