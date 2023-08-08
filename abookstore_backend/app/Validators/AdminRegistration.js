'use strict'

class AdminRegistration {
  get rules () {
    return {
      // validation rules
      first_name: 'required',
      email: 'required|email',
      password: 'required|confirmed|min:6',
    }
  }

  get messages(){
    return {
      'first_name.required' : 'First name is required',
      'email.required'      : 'A valid email address is required.',
      'password.required'   : 'Password must be provided.',
      'password.confirmed'  : 'Password and confirm password must be matched.',
      'password.min'        : 'Password minimum length should be 6'
    }
  }

  async fails(errorMessage){
      this.ctx.session.withErrors(errorMessage).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = AdminRegistration
