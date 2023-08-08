'use strict'

const Mail = use('Mail')

class MailController {

  async sendMail ({response}) {
    try {

      await Mail.raw('Test email using AdonisJS and MailGun!!!',(message) => {
        message
          .to('imrulkk69@gmail.com')
          .from('support@abookstore.co.ke')
      })

      return response.status(200).json({
        status: true,
        message: 'Mail send successfully.'
      })

    } catch (error) {
      console.log('mail sending error: ', error)
      return response.status(500).json({
        status: false,
        message: 'Can not sent Mail.'
      })
    }
  }
}

module.exports = MailController
