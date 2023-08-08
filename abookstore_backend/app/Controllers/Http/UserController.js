'use strict'

const Hash = use('Hash')

//Load Models
const Database = use('Database')
const User = use('App/Models/User')
/* const Address         =   use('App/Models/Address')
const Payment         =   use('App/Models/Payment') */
const RoleException = use('App/Exceptions/RoleException')

class UserController {

  /**
   * Show all user.
   * Web GET users
   *
   * @param {object} ctx
   * @param {view} ctx.view
   */

  async index({view, session, response}) {
    try {
      const admins = await User.query()
        .whereNot('user_type', 'USER')
        .fetch()

      return view.render('user.all-users', {
        title: "All users",
        users_nav: true,
        allUsers_nav: true,
        admins: admins.toJSON()
      })

    } catch (error) {
      session.flash({notification_failure: 'Failed to populate all admins.'})
      session.flashAll()
      return response.redirect('back')
    }
  }

  /**
   * Create user.
   * Web GET create-users
   *
   * @param {object} ctx
   * @param {view} ctx.view
   */
  async create({auth, view}) {

    if (auth.user.user_type !== 'SUPER_ADMIN')
      throw new RoleException("You are not authorized!", 401, 'E_NOT_AUTHORIZED')

    return view.render('user.create-user', {
      title: "Create User",
      users_nav: true,
      create_user_nav: true
    })
  }


  /**
   * Show all data of a user.
   * API GET user data
   *
   * @param {object} ctx
   * @param {Auth} ctx.auth
   * @param {Response} ctx.response
   */

  async getUser({auth, response}) {

    try {

      const user = await auth.authenticator('jwt').getUser()
      const userOrders = await Database.select(
        'orders.order_code',
        'books.id as book_id',
        'books.name',
        'books.price',
        'book_orders.quantity',
        'orders.created_at',
        'orders.status'
      )
        .from('book_orders')
        .leftJoin('books', 'book_orders.book_id', 'books.id')
        .leftJoin('orders', 'book_orders.order_id', 'orders.id')
        .where('book_orders.user_id', user.id)

      const orderList = []
      userOrders.map(item => {
        orderList.push({
          ...item,
          total: item.price * item.quantity
        })
      })


      /* user.payment = payment.toJSON() */
      user.order = orderList

      return response.status(200).json({
        success: true,
        messages: "requested user data populated successfully.",
        data: user
      });

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        success: false,
        messages: "could not populate requested user data.",
      });

    }

  }

  /**
   * Update data of a user.
   * API GET user data
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Auth} ctx.auth
   * @param {Response} ctx.response
   */
  async update({request, auth, response}) {

    const data = request.only([
      'category_id',
      'email',
      'first_name',
      'last_name',
      'phone',
      'password',
      'new_password',
    ])

    try {
      const user = await auth.authenticator('jwt').getUser()

      if (data.password && data.new_password) {

        const userPassword = await Database.select('password')
          .from('users')
          .where('email', user.email)

        const passControl = await Hash.verify(data.password, userPassword[0].password)

        if (!passControl) {
          return response.status(412).json({
            success: false,
            messages: "Current password did not match with previous one.",
          });
        }

        data.password = data.new_password
      }

      //const address = await Address.findBy('user_id', user.id)
      if (data.phone) user.phone = data.phone
      if (data.category_id) user.category_id = data.category_id
      if (data.first_name) user.first_name = data.first_name
      if (data.last_name) user.last_name = data.last_name
      if (data.password) user.password = data.password
      if (data.email) user.email = data.email

      //await address.save()
      await user.save()

      return response.status(200).json({
        success: true,
        messages: "User info updated",
        data: user
      });

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        success: false,
        messages: "Could not update user info.",
      });
    }

  }

}

module.exports = UserController
