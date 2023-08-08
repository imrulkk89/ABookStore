'use strict'
const Logger = use('Logger')
const Customer = use('App/Models/User');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with customers
 */
class CustomerController {
  /**
   * Show a list of all customers.
   * GET customers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ session, view }) {
    try {

      const customers = await Customer.query().where('user_type', 'USER').fetch()

      return view.render('customers.index', {
        customers: customers.toJSON(),
        customer_nav: true
      })

    } catch (error) {
      console.log(error)
      session.flash({
        notification_failure: "Server Error"
      });
      return session.flashAll();
    }
  }

  /**
   * Render a form to be used for creating a new customer.
   * GET customers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {

  }

  /**
   * Create/save a new customer.
   * POST customers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

  }

  /**
   * Display a single customer.
   * GET customers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const { id } = params
    try {

    } catch (error) {

    }
  }

  /**
   * Render a form to update an existing customer.
   * GET customers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
    const { id } = params
    try {
      const customer = await Customer.find(id)
      return view.render('customers.edit', {
        customer: customer.toJSON(),
        customer_nav: true
      })

    } catch (error) {
      console.log(`CustomerController::edit error - ${error}`)
      session.flash({
        notification_failure: "Server Error"
      });
      return session.flashAll();
    }
  }

  /**
   * Update customer details.
   * PUT or PATCH customers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response }) {

    const customer = request.only(['id', 'first_name', 'last_name', 'email', 'phone', 'password'])

    try {

      if (!customer.password) {
        delete customer.password
      }

      await Customer.query()
        .where('id', customer.id)
        .update(customer)

      return response.redirect('/admin/customer')

    } catch (error) {
      console.log(`CustomerController::update ${error}`)
      session.flash({
        notification_failure: error.sqlMessage
      });
      session.flashAll()
      return response.redirect('back')
    }
  }

  /**
   * Delete a customer with id.
   * DELETE customers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, session, response }) {
    const { id } = params
    try {
      const customer = await Customer.find(id)
      await customer.delete()

      session.flash({
        notification_success: "Deleted Successfully"
      })

      session.flashAll()
      return response.redirect('/admin/customer')

    } catch (error) {

      Logger.error(`CustomerController::destroy - ${error}`)
      session.flash({
        notification_failure: "Server Error"
      })

      session.flashAll()
      return response.redirect('back')
    }
  }
}

module.exports = CustomerController
