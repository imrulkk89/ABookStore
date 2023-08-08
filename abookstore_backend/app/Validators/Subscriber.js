'use strict'

class Subscriber {
  get rules () {
    return {
      email: 'required|email|unique:subscribers',
    }
  }

  get messages(){
    return {
      'email.required'      : 'A valid email address is required',
      'email.unique'        : 'Subscriber already exist'
    }
  }

  async fails(errorMessage){
    return this.ctx.response.status(200).json({
      message: errorMessage
    })
  }
}

module.exports = Subscriber
