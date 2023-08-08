'use strict'
const User = use('App/Models/User')
const Category = use('App/Models/Category')
const ResetPassword = use("App/Models/ResetPassword");
const Mail = use("Mail");
const Logger = use('Logger')
const { validate } = use('Validator')
const { EmailConfirmationTem } = use('./EmailTemplate')

class AuthController {

  async register({ request, response }) {
    const { first_name, last_name, email, password } = request.all();

    try {
      const findUser = await User.findBy("email", email)
      if (findUser) {
        return response.status(302).json(
          {
            success: false,
            message: `The email address is already in use. Please try another email address`
          }
        )
      }

      if (!findUser) {
        const token = this.verifyCodeGen(8)

        const isReg = await User.create({
          user_type: "USER",
          first_name,
          last_name,
          email,
          password: password,
          confirmToken: String(token)
        })

        if (isReg) {
          const link = `https://admin.abookstore.co.ke/api/account-confirm/${token}`
          await Mail.raw(EmailConfirmationTem(link),
            message => {
              message.from("support@abookstore.co.ke");
              message.to(email);
              message.subject("Email Address Verification");
            }
          );
        }
        return response.status(201).json({
          success: true,
          message: `Congrats! Your Registration successfully done. Check your email for verify your account.`
        });
      }
    } catch (error) {
      Logger.error(`AuthController::register - ${error}`)
      return response.status(500).json({
        success: false,
        message: `Couldn't complete the registration.`,
      });
    }
  }

  async confirmToken({ params, response }) {
    const { token } = params

    //console.log(token)

    try {
      const activate = await User.findBy("confirmToken", token);
      if (activate) {
        activate.confirmToken = ''
        await activate.save()
        return response.redirect("https://abookstore.co.ke/login");
      } else {
        return response.status(304).json({
          message: "Your token is not valid please try again",
          success: false
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        message: "Server Error Occurred",
        success: false
      })
    }
  }

  async oAuthLogin({ request, response, auth }) {

    const { id, email, name, phone, photo, provider } = request.post()
  
    try {
       const oAuthUser = await User.findBy('email', email);
       
       if(oAuthUser) {

          const token = await auth.withRefreshToken().generate(oAuthUser, true);
          return response
            .status(200)
            .json({
              success: true,
              message: `Login successful.`,
              data: token
            });

        }else{

          const createUser = await User.create({
            category_id: (await Category.first()).id,
            user_type: "USER",
            first_name: name,
            last_name: null,
            email,
            password: id,
            confirmToken: null
          });

          const token = await auth.withRefreshToken().generate(createUser, true);
          return response
            .status(200)
            .json({
              success: true,
              message: `Login successful.`,
              data: token
            });
        }
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        message: "Login failed",
        success: false
      });
    }
  }

  async login({ request, auth, response }) {

    const { email, password, refreshToken } = request.only(["email", "password", "refreshToken"])

    try {

      if (refreshToken) {
        const token = await auth.generateForRefreshToken(refreshToken, true);
        return response.status(200).json({
          success: true,
          message: `Login successful.`,
          data: token
        })
      }

      const user = await User.findBy('email', email)

      if (user.confirmToken)
        return response.status(403).json({
          message: "Sorry! your account not active yet ! Please, check your mail we have been sent a link to verify your email address.",
          success: false
        })

      if (await auth.attempt(email, password)) {

        const token = await auth.withRefreshToken().generate(user, true)
        user.last_login = new Date()
        user.isLogin = true

        await user.save()

        return response.status(200).json({
          success: true,
          message: `Login successful.`,
          data: token
        })
      }
    } catch (ex) {
      console.log(ex)
      return response.status(401).json({
        success: false,
        message: `Login failed.`
      });
    }
  }

  async logout({ request, auth, response }) {
    const refreshToken = request.input("refreshToken");

    if (!refreshToken) {
      console.log(`For logout, refresh token not provided.`);
      return response.status(401).json({
        success: false,
        message: `Logout failed.`
      });
    }

    await auth.authenticator("jwt").revokeTokens([refreshToken], true);
    const user = await User.findOrFail(auth.user.id);
    user.last_logout = new Date();
    user.isLogin = false;
    await user.save();
    return response.status(200).json({
      success: true,
      message: `Logout successfully.`
    });
  }

  async sendVerificationCode({ request, response }) {
    try {
      const { email } = request.only(["email"]);
      const validation = await validate(email, { email: 'required|email' })
      if (validation.fails()) {
        return response.status(400).json({
          message: validation.messages()[0].message,
          success: false,
        })
      }

      const isUserByEmail = await User.findBy("email", email);

      if (!isUserByEmail) {
        return response.status(404).json({
          message: "Email does not exist!",
          success: false
        });
      } if (isUserByEmail) {

        const now = new Date();
        const verify_code = this.verifyCodeGen(6);
        const isUserReset = await ResetPassword.findBy("user_id", isUserByEmail.id);

        if (isUserReset) {
          isUserReset.verify_code = verify_code;
          isUserReset.resetPasswordExpire = now;
          const isUpdateCode = await isUserReset.save();
          if (isUpdateCode) {
            await this.sendMail(verify_code, "Reset Password code", email);
            return response.status(200).json({
              message: "Your Reset code has been sended " + email + " please check!",
              success: true
            });
          }
        } else {
          const reset_password = await ResetPassword.create({
            user_id: isUserByEmail.id,
            verify_code: verify_code,
            resetPasswordExpire: now
          });

          if (reset_password) {
            this.sendMail(verify_code, "Reset Password code", email);
            return response.status(200).json({
              message: `Your reset code has been sended ${email} please check!`,
              success: true
            });
          }
        }
      }
    } catch (error) {
      Logger.error(error)
      return response.status(500).json({
        message: "Sorry! for Internal Server Error. Be patient and Stay with us",
        success: false
      });
    }
  }

  async verifyCode({ request, response }) {
    try {
      const { code } = request.only(["code"]);
      const validation = await validate(code, { code: 'required' })
      if (validation.fails()) {
        return response.status(404).json({
          message: validation.message()[0].message,
          success: false,
        })
      } else {
        const verify_code = await ResetPassword.findBy("verify_code", code);
        if (!verify_code) {
          return response.status(404).json({
            message: "Code doesn't match!",
            success: false,
          })
        } if (verify_code) {
          return response.status(200).json({
            message: 'Congrats! Now you can change your password',
            success: true,
            code: code
          })
        }
      }
    } catch (error) {
      return response.status(404).json({
        message: "Server error occurred",
        success: false
      })
    }
  }

  async recoverPassword({ request, response }) {
    try {
      const { password, confirmPassword, verifyCode } = request.post();
      if (!password) {
        return response.status(404).json({
          message: "Password should not be empty",
          success: false
        })
      }
      if (!confirmPassword) {
        return response.status(404).json({
          message: "Confirm Password should not be empty",
          success: false
        });
      }
      if (password !== confirmPassword) {
        return response.status(404).json({
          message: "Password and confirm password should be same",
          success: false
        });
      }
      if (!verifyCode) {
        return response.status(404).json({
          message: "Verify code should not be empty",
          success: false
        });
      }


      const matchCode = await ResetPassword.findBy("verify_code", verifyCode);

      if (!matchCode) {
        return response.status(404).json({
          message: "Enter verification code is not valid, Try again with valid 6 digit code",
          success: false
        })
      }

      else if (matchCode) {
        const user = await User.find(matchCode.user_id)
        if (user) {
          user.password = password;
          await user.save();
          matchCode.verify_code = null;
          await matchCode.save();
          return response.status(200).json({
            message: "Your password reset successfully",
            success: true
          })
        }
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        message: "Server error occurred",
        success: false
      })
    }
  }

  verifyCodeGen(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async sendMail(code, subject, sendTo, sendFrom = "support@abookstore.co.ke") {
    try {
      await Mail.raw(`Dear User your Verification code ${code}`, message => {
        message
          .to(sendTo)
          .from(sendFrom)
          .subject(subject);
      });
    } catch (error) {
      Logger.error(error);
      return response.status(500).json({
        status: false,
        message: "Can not sent Mail."
      });
    }
  }

}

module.exports = AuthController
