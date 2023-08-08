'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const paymentService      = require('./paymentService')

class PaymentProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Adonis/Services/Payment', (app) => {
      const config = app.use('Adonis/Src/Config')._config          
      return new paymentService(config.payment)
    })

    this.app.alias('Adonis/Services/Payment', 'Payment')
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
   
  }
}

module.exports = PaymentProvider
