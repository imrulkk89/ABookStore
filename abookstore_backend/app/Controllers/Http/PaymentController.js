'use strict'

const Logger        = use('Logger')
const Payment         = use('App/Models/Payment')
const Config = use('Config')
const paypal = require('paypal-rest-sdk');
class PaymentController {
  /**
   * Provide all the payment.
   * GET payment info
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Auth} ctx.auth
   * @param {Response} ctx.response
   */



     /**
   * Set payment info
   * POST payment info
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Auth} ctx.auth
   * @param {Response} ctx.response
   */
  async store({ request, auth, response }){
    const card_info = request.all()

    try{
      const user = await auth.authenticator('jwt').getUser()

      const isExist = await Payment.findBy('card_number', card_info.card_number)

      if(!isExist){
        delete card_info.id
        await Payment.create({...card_info, user_id: user.id})
      }

      const userPaymentInfo = await Payment.query()
                                     .where('user_id', user.id)
                                     .fetch()

      return response.status(200).json({
        success: true,
        message: "payment info saved successfully.",
        data: userPaymentInfo
      });

    }catch(error){
      console.log(error);

      return response.status(500).json({
        success: false,
        message: "could not save payment info."
      });
    }
  }


  async update({request,response}) {
    try {
      const { id, card_number, mm, yy, ccv} = request.only(['id', 'card_number', 'mm', 'yy', 'cvv'])
      const updatePayment = await Payment.query()
                                        .where('id', id)
                                        .update({ card_number: card_number, mm: mm, yy: yy, cvv: ccv })


      if (updatePayment) {
        return response.status(200).json({
          message: "Payment Method update successfully",
          success: true,
          data: await Payment.find(id)
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        message: "server error occurred",
        success:false
      })
    }


  }

     /**
   * Set payment info
   * POST payment info
   *
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {Auth} ctx.auth
   * @param {Response} ctx.response
   */
  async delete({ params, auth, response}){
    const { id } = params
    try{
      const user = await auth.authenticator('jwt').getUser()

      await Payment.query()
                   .where('id', id)
                   .delete()

      const paymentInfo = await Payment.query()
                                       .where('user_id', user.id)
                                       .fetch()

      return response.status(200).json({
        success: true,
        message: "payment info saved successfully.",
        data: paymentInfo
      });

    }catch(error){
      console.log(error);
      return response.status(500).json({
        success: false,
        message: "could not save payment info."
      });
    }
  }


/*
  async payCreate({view}) {
    return view.render('welcome')
  }

  async pay({request,response,session}) {
    try {
      paypal.configure(Config.get('payment.paypal'))
      const create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": "http://localhost:3333/success",
          "cancel_url": "http://localhost:3333/cancel"
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": "Red Sox Hat",
              "sku": "001",
              "price": "25.00",
              "currency": "USD",
              "quantity": 1
            }]
          },
          "amount": {
            "currency": "USD",
            "total": "25.00"
          },
          "description": "Hat for the best team ever"
        }]
      }

     paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === 'approval_url') {
              response.redirect(payment.links[i].href);
            }
          }
        }
     });
    } catch (error) {
      Logger.error(error)
      return response.status(500).json({
        message:error
      })
    }
  }


  async paySuccess({response}) {
    return response.status(200).json('success')
  }
  async payCancel({response}) {
    return response.status(200).json('cancelled')
  } */

}

module.exports = PaymentController
