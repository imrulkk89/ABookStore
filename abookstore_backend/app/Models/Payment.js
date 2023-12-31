'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Payment extends Model {
  static get hidden() {
    return ['ccv', 'created_at', 'updated_at']
  }
}

module.exports = Payment
