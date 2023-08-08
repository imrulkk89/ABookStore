'use strict'


const Drive = use('Drive')
const logger = use('Logger')
const Sharp = require('sharp')

const Category = use('App/Models/Category')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {

    const categories = await Category.all();

    return view.render('product.category', {
      product: true,
      category: true,
      title: 'Book eCommerce',
      categories: categories.toJSON()
    })
  }

  /**
   * Render a form to be used for creating a new category.
   * GET categories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, session }) {

    logger.level = 'console'

    //const categoryData = request.only(['category','description'])

    const categoryData = {}

    request.multipart.field((name, value) => {
      categoryData[name] = value
    })

    let transform = Sharp();

    request.multipart.file('category_image', { types: ['image'], size: '19mb' }, async (file) => {

      try {

        const ContentType = file.headers['content-type']
        const ACL = 'public-read'
        const Key = `${(Math.random() * 100).toString(32)}-${file.clientName}`

        const data = await transform
          .resize({ width: 370, height: 520 }) // width: 370, height: 520
          .jpeg({
            quality: 90,
            chromaSubsampling: '4:4:4'
          })
          .toFormat('jpeg')

        file.stream.pipe(transform).pipe(data)

        const url = await Drive.put(Key, data, {
          ContentType,
          ACL
        })

        categoryData.image = url

      } catch (error) {
        console.log(error)
        session.flash({ notification_failure: 'Failed to add Category. Server error' })
        session.flashAll()
        return response.redirect('back')
      }
    })

    try {
      await request.multipart.process()
    } catch (error) {
      console.log('multipart process did not worked ', error)
      session.flash({ notification_failure: 'Failed to add Category. Server error' })
      session.flashAll()
      return response.redirect('back')
    }


    try {

      delete categoryData._csrf
      await Category.create(categoryData);

      logger.info('Category saved successfully')
      return response.redirect('/admin/category')

    } catch (error) {

      logger.error(error);
      return response.redirect('back')
    }

  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing category.
   * GET categories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, response, view }) {
    const { id } = params
    try {
      const category = await Category.findBy('id', id)
      const categories = await Category.all()

      return view.render('product.single-category', {
        product: true,
        category: true,
        title: 'Edit Category',
        category: category.toJSON(),
        categories: categories.toJSON()
      })

    } catch (error) {
      console.log(error)
      response.redirect('back')
    }
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, session, response }) {

    const data = {}

    const categoryData = await Category.find(params.id)

    request.multipart.field((name, value) => {
      data[name] = value
    })

    let transform = Sharp();

    request.multipart.file('category_image', { types: ['image'], size: '19mb' }, async (file) => {

      try {

        const ContentType = file.headers['content-type']
        const ACL = 'public-read'
        const Key = `${(Math.random() * 100).toString(32)}-${file.clientName}`

        const data = await transform
          .resize({ width: 370, height: 520 }) // width: 370, height: 520
          .jpeg({
            quality: 90,
            chromaSubsampling: '4:4:4'
          })
          .toFormat('jpeg')

        file.stream.pipe(transform).pipe(data)

        const url = await Drive.put(Key, data, {
          ContentType,
          ACL
        })

        categoryData.image = url

      } catch (error) {
        console.log(error)
        session.flash({ notification_failure: 'Failed to update Category. Server error' })
        session.flashAll()
        return response.redirect('back')
      }
    })

    try {
      await request.multipart.process()
    } catch (error) {
      console.log('multipart process did not worked ', error)
      session.flash({ notification_failure: 'Failed to update Category. Server error' })
      session.flashAll()
      return response.redirect('back')
    }

    categoryData.category = String(data.category)
    categoryData.description = data.description

    try {

      categoryData.save()

      session.flash({ notification_success: 'Category updated successfully.' })
      return response.redirect('/admin/category')
    } catch (error) {

      session.flash({ notification_failure: 'Failed to update Category' })
      return response.redirect('back')
    }


  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response, session }) {
    const { id } = params;
    try {
      const category = await Category.find(id)
      await category.delete()
      session.flash({
        notification: {
          type: 'success',
          message: "Success fully deleted"
        }
      })
      return response.redirect('back')
    } catch (error) {
      console.log(error)
      session.flash({
        notification: {
          type: 'danger',
          message: "Failed To delete"
        }
      })
      return response.redirect('back')
    }
  }

  /**
 * Show a list of all categories for API.
 * GET categories
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
  async allCategory({ request, response }) {

    const categories = await Category.all();

    return response.status(200).json({
      success: true,
      message: "All categories populated successfully",
      data: categories
    });
  }

}

module.exports = CategoryController
