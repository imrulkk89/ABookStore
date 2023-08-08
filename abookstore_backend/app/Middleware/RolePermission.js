'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Permission      = use('App/Models/Permission');
const Logger          = use('Logger')
const User            = use('App/Models/User')
const RoleException   = use('App/Exceptions/RoleException')

class RolePermission {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({auth,request,response }, next) {
    try {
      const roles = ['ADMIN','MAINTAINER']

      if(auth.check()){

        if(auth.user.user_type === 'SUPER_ADMIN'){
          await next()

        }else{

          if(!roles.includes(auth.user.user_type)) {
            throw new RoleException("You are not authorized!", 401, 'E_NOT_AUTHORIZED')

          }else{
            await next()

            /* const permission  = await Permission.all()
            const permissions = permission.toJSON()

            console.log('request URL: ', request.url())

            if(permissions.includes(request.url()))
                await next()

            throw new AdminException('You are not authorize for this page',false,404) */
          }
        }
      }
    } catch (error) {
        Logger.error(`RolePermission::handle -${error}`)
      return response.route('/unauthorized')
    }
  }
}

module.exports = RolePermission
