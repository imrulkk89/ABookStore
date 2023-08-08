'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const message = 'Credentials Mismatched!'
const status = 401
const code = 'E_NOT_AUTH'

class AuthenticationException extends LogicalException {

  constructor () {
    super(message, status, code)
  }

  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = AuthenticationException
