"use strict";

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");
const User = use("App/Models/User")
const RoleException = use('App/Exceptions/RoleException')
const NotCreatedException = use('App/Exceptions/NotCreatedException')
const AuthenticationException = use('App/Exceptions/AuthenticationException')

class AdminController {
  /**
   * Show the login page.
   * GET login page
   *
   * @param {object} ctx
   * @param {View} ctx.view
   * @param {Auth} ctx.auth
   * @param {Response} ctx.response
   */
  async index({auth, view, response}) {
    try {
      await auth.authenticator("session").check();
      return response.redirect("/admin/dashboard");
    } catch (error) {
      return view.render("auth.login");
    }
  }

  /**
   * Login attempt. If success show the dashboard
   * POST login data
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   * @param {Session} ctx.session
   */
  async login({request, auth, session, response}) {

    const {email, password} = request.only(["email", "password"])

    try {

      const roles = ['SUPER_ADMIN', 'ADMIN', 'MAINTAINER']

      const user = await User.query()
        .where('email', email)
        .first()

      const passwordMatch = await Hash.verify(password, user.password)

      /* if(!user)
          throw new NotFoundException('User not found with this mail please try agin with valid mail', false, 403)

      if(!passwordMatch)
          throw new PasswordNotMatchException("Your password not match please try again", false, 400) */

      if (!user || !passwordMatch)
        throw new AuthenticationException('Password or Email address did not matched!', 401, 'E_NOT_AUTH')

      if (!roles.includes(user.user_type))
        throw new RoleException("You are not authorized!", 401, 'E_NOT_AUTHORIZED')

      await auth.authenticator("session")
        .loginViaId(user.id)

      session.flash({notification_success: "Welcome to AbookStore"})

      await User.query()
        .where('id', user.id)
        .update({last_login: new Date(), isLogin: true})

      return response.redirect("/admin/dashboard")
    } catch (error) {

      /* session.flash({
        notification_failure:error.message === 'connect ECONNREFUSED 127.0.0.1:3306'?"Database not connected make sure Db Connection": error.message
      }) */
      console.log(`AdminController::login - ${error}`)

      return response.redirect('back')
    }
  }

  /**
   * Logout attempt. If success show the Login page
   * POST login data
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async logout({response, auth}) {
    const date = new Date();
    try {
      const user = await User.findOrFail(auth.user.id);
      user.last_logout = date;
      user.isLogin = false;
      await user.save();
      await auth.authenticator("session").logout();
      return response.redirect("/admin");
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Register a new user
   * POST user data
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async register({request, session, response}) {
    const {first_name, last_name, email, password, user_type} = request.all();

    try {
      const addedUser = await User.create({user_type, first_name, last_name, email, password});
      if (!addedUser)
        throw new NotCreatedException('Registration Failed', 501, 'E_NOT_CREATED')

      session.flash({notification_success: "User Registered successfully."})

      return response.redirect("/admin/all-users")
    } catch (error) {

      session.flash({
        notification_failure: error.message === 'connect ECONNREFUSED 127.0.0.1:3306' ?
          "Database not connected make sure Db Connection" : error.message
      })
      return response.redirect("back");
    }
  }

  async edit({view, params, response}) {
    try {
      const {id} = params;
      const user = await User.findOrFail(id);
      return view.render("user.edit", {
        title: "User Edit",
        message: "User found successfully",
        user: user.toJSON(),
        success: true
      });
    } catch (error) {
      console.log(error);
      return response.redirect("back");
    }
  }

  async update({request, response, session}) {
    try {
      const {id, first_name, last_name, email, password, user_type} = request.all();
      try {
        const user = await User.findOrFail(id);
        user.first_name = first_name;
        user.last_name = last_name;
        user.password = password;
        user.email = email;
        user.user_type = user_type;
        await user.save();

        session.flash({
          notification_success: "User Updated successfully."
        });
        return response.redirect("/admin/all-users");
      } catch (error) {
        console.log(error);
        session.flash({notification_failure: "Failed to update user."});
        session.flashAll();
        return response.redirect("back");
      }
    } catch (error) {
    }
  }


  async destroy({response, params, session}) {
    const {id} = params
    try {
      const user = await User.find(id)
      await user.delete()

      session.flash({
        notification_success: "User deleted successfully."
      })

      session.flashAll()

      return response.redirect('/admin/all-users')
    } catch (error) {

      console.error(`AdminController::destroy -${error}`)

      session.flash({notification_failure: "Failed to delete user."})
      session.flashAll()

      return response.redirect('back')
    }
  }
}

module.exports = AdminController;
