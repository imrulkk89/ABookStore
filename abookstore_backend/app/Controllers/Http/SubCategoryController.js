'use strict'

const logger          = use('Logger');
const Category        = use('App/Models/Category')
const SubCategory     = use('App/Models/SubCategory')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with subcategories
 */
class SubCategoryController {
  /**
   * Show a list of all subcategories.
   * GET subcategories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {

    const categories      = await Category.all()
    const sub_categories  = await SubCategory.all()

      return view.render('product.sub_category', {
        product: true,
        sub_category: true,
        title: 'Book eCommerce',
        categories: categories.toJSON(),
        sub_categories: sub_categories.toJSON()
      })
  }

  /**
   * Render a form to be used for creating a new subcategory.
   * GET subcategories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new subcategory.
   * POST subcategories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

    const SubCategoryData = request.only(['category_id', 'sub_category'])

    try{
      await SubCategory.create(SubCategoryData);

      logger.info('Sub-Category saved successfully')
      return response.redirect('/admin/sub-category')

     }catch(error){

       logger.error(error);
       return response.redirect('back')
     }
  }

  /**
   * Display a single subcategory.
   * GET subcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing subcategory.
   * GET subcategories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update subcategory details.
   * PUT or PATCH subcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a subcategory with id.
   * DELETE subcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  /**
   * API
   * Sub Category list by category id.
   * GET subcategories/:id
   *
   * @param {object} ctx
   * @param {Params} ctx.param
   * @param {Response} ctx.response
   */
  async getSubCategory({ params, response }){

    const category = params.id

   try {
    const subCategories = await SubCategory.query()
                                    .where('category_id', category)
                                    .fetch()

    return response.status(200).json({
      success: true,
      messages: "sub-category populated successfully",
      data: subCategories.toJSON()
    })

   } catch (error) {
     console.log(error)
      return response.status(500).json({
        success: false,
        messages: "could not populate sub-category"
      })
   }
  }
}

module.exports = SubCategoryController
