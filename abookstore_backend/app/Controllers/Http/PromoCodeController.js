'use strict'
const PromoCode = use('App/Models/PromoCode')
const { validate } = use('Validator')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with promocodes
 */
class PromoCodeController {
  /**
   * Show a list of all promocodes.
   * GET promocodes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const promocode = await PromoCode.all();
     return view.render('coupon.promo',{
       title: 'Promo Code',
       promo_nav: true,
       promos:true,
       promocodes: promocode.toJSON()
      })

    } catch (error) {
      console.log(error)
     return response.redirect('back')
    }
  }

  /**
   * Render a form to be used for creating a new promocode.
   * GET promocodes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    try {
      return view.render('coupon.promo-create',{
          title: "Create Promo",
          promo_nav: true,
          promo_create:true
      })
    } catch (error) {
      return redirect.back()
    }
  }

  /**
   * Create/save a new promocode.
   * POST promocodes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response ,session }) {
    const validation = await validate(request.all(), {
      code: 'required',
      discount: 'required',
      upto: 'required',
      valid_till: 'required',
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())
              .flashAll()
      return response.redirect('back')
    }


    const promocode = new PromoCode()
    promocode.code = request.input('code')
    promocode.discount = request.input('discount')
    promocode.upto = request.input('upto')
    promocode.valid_till = request.input('valid_till')
    await promocode.save()

    // Fash success message to session
    session.flash({ notification: 'Promocode added!' })

    return response.redirect('back')

  }

  /**
   * Display a single promocode.
   * GET promocodes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing promocode.
   * GET promocodes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update promocode details.
   * PUT or PATCH promocodes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a promocode with id.
   * DELETE promocodes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response ,session}) {
  try {
    const promocode = await PromoCode.find(params.id)
     await promocode.delete()
     session.flash({ notification: 'Coupon deleted!' })
     return response.redirect('back')
  } catch (error) {
    console.log(error)
    return response.redirect('back')
  }

  }


async filter ({request, view, response}){

 try {
  const keyWord = decodeURIComponent(request.body.keyword)

  const promocode = await PromoCode.findBy('code', keyWord)
    return view.render('coupon.promo',{
                         title:'Search',
                         promocodes: [ promocode.toJSON() ]
                        })

  } catch (error) {
    return response.redirect('/admin/promo-code')
  }

}


async getPromoInfo({params, response}){

  const {code} = params

  try {

    const today = new Date()

    const promoInfo = await PromoCode.query()
                                     .where('code', code)
                                     .where('valid_till', '>', today )
                                     .fetch()

    if(promoInfo.rows.length === 0){
      return response.status(203).json({
          success: false,
          messages: "Promo not found or expired.",
        });
    }

    return response.status(200).json({
      success: true,
      messages: "Promo Code info populated successfully.",
      data: promoInfo.rows[0]
    });

  } catch (error) {
    console.log(error)
    return response.status(500).json({
      success: false,
      messages: "could not populate requested promo code info.",
    });
  }

}


}

module.exports = PromoCodeController
