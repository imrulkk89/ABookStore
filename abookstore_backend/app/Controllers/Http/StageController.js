 'use strict'


const logger          = use('Logger')
const Category        = use('App/Models/Category')
const Stage           = use('App/Models/Stage')
const Book            = use('App/Models/Book')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with stages
 */
class StageController {
  /**
   * Show a list of all stages.
   * GET stages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {

    const categories      = await Category.all()
    const stages          = await Stage.query()
        .with("category", builder => {
          return builder.select(["id", "category"]);
        })
        .fetch();

      return view.render('product.stages', {
        product: true,
        stage_nav: true,
        title: 'Book eCommerce',
        categories: categories.toJSON(),
        stages: stages.toJSON()
      })
  }

  /**
   * Render a form to be used for creating a new stage.
   * GET stages/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new stage.
   * POST stages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

    const stageData = request.only(['category_id', 'stage'])

    try{
      const isExist = await Stage.findBy('stage', stageData.stage)
      if(isExist === null){
        await Stage.create(stageData)
      }

      logger.info('Stages saved successfully')
      return response.redirect('/admin/stage')

     }catch(error){
       logger.error(error);
       return response.redirect('back')
     }
  }

  /**
   * Display a single stage.
   * GET stages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing stage.
   * GET stages/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params,response, view,session}) {
    const { id } = params;
    try {
      const stage = await Stage.find(id)
      const categories = await Category.all()

      if(stage){
        session.flash({
          notification:{
             type:"success",
             message:"Edit Stage"
          }
        })
        return view.render('product.edit-stage',{stage:stage,categories:categories.toJSON()})
      }
    } catch (error) {
       session.flash({
         notification:{
           type:"danger",
           message:"Server Error"
         }
       })
       return response.redirect('back')
    }
  }

  /**
   * Update stage details.
   * PUT or PATCH stages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response,session}) {
    const {id} = params;
    const {category_id,stage} = request.all();

     try {
       const updateStage = await Stage.query().where('id',id).update({
        category_id,
        stage
       })

       if(updateStage){
         session.flash({
           notification:{
             type:'success',
             message:'Updated Successfully'
           }
         })
         return response.redirect('back')
       }
     } catch (error) {
        session.flash({
          notification:{
            type:"danger",
            message:"Update failed"
          }
        })
        return response.redirect('back')
     }
  }

  /**
   * Delete a stage with id.
   * DELETE stages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, session, response }) {
    const {id} = params
    try {

      const stage = await Stage.find(id)
                    await stage.delete()
        session.flash({
          notification:{
            type:'success',
            message:'Delete Successfully'
          }
        })
        return response.redirect('back')
    } catch (error) {
      session.flash({
        notification:{
          type:'danger',
          message:"Delete failed"
        }
      })
      return response.redirect('back')
    }
  }

    /**
   * API
   * Stage list by category id.
   * GET stages/:id
   *
   * @param {object} ctx
   * @param {Params} ctx.param
   * @param {Response} ctx.response
   */
  async getStages({ params, response }){

    const category = params.id

   try {
    const stages = await Stage.query()
                              .where('category_id', category)
                              .fetch()

    return response.status(200).json({
                                success: true,
                                messages: "Stages populated successfully",
                                data: stages.toJSON()
    })

   } catch (error) {
     console.log(error)
      return response.status(500).json({
        success: false,
        messages: "could not populate stages"
      })
   }
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

  async getBooks({params, response}){

    const { id, page, show } = params

    try {
      const maxPrice = await Book.query()
        .where("isDeleted", false)
        .where("stage", id)
        .max("price as maxPrice");
      const minPrice = await Book.query()
        .where("isDeleted", false)
        .where('stage',id)
        .min("price as minPrice");
          const stageBooks = await Stage.query()
                                   .with('books', builder => {
                                                  builder
                                                    .select("*")
                                                    .with("book_author")
                                                    .with("book_discipline")
                                                    .with("book_language")
                                                    .with("book_publisher")
                                                    .with("book_publishing_year")
                                                    //.with("book_covers")
                                                    .with("book_stage")

                                                    .where("isDeleted", false)
                                                    .forPage(page, show);
                                   })
                                    .where('id', id)
                                    .fetch()

          const _books = stageBooks.toJSON()
          const total_books = _books[0].total_books

          const data = _books.map(item => item.books)

          return response.status(200).json({
            status: true,
            message: "Books of this stage found.",
            page: Number(page),
            show: Number(show),
            total: total_books,
            totalPage: Math.ceil(total_books / show),
            price: [...maxPrice, ...minPrice],
            data: [...data[0]]
          });
      }
      catch (ex) {
        console.log(ex)
          return response.status(204).json({
              status      :false,
              message     :"No books found of this stage."
          })
      }
  }
}

module.exports = StageController
