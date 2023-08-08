'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ResetPassword extends Model {
    static get table(){
        return 'reset_passwords'
      }

    static get hidden() {
        return ['created_at', 'updated_at']
      }

    user(){
        this.hasMany('App/Models/User', 'user_id', 'id')
    }
}

module.exports = ResetPassword

