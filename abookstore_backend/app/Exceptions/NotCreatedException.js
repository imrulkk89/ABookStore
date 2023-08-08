'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const message = 'Entry not created!'
const status = 501
const code = 'E_NOT_CREATED'

class NotCreatedException extends LogicalException {
  constructor () {
    super(message, status, code)
  }
}

module.exports = NotCreatedException
