'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const message = 'You are not authorized!'
const status = 401
const code = 'E_NOT_AUTHORIZED'

class RoleException extends LogicalException {

  constructor () {
    super(message, status, code)
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = RoleException
