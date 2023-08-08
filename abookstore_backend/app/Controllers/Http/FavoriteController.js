'use strict'

const Favorite    = use('App/Models/Favorite')

class FavoriteController {

  async getFavoriteItems({auth, response}){

    try{

      const user = await auth.authenticator('jwt').getUser()

      const items = await Favorite.query()
                                       .with('books', builder => {
                                          builder.select(['id', 'name', 'cover_images', 'price', 'author'])
                                          .with('book_author') }
                                        )
                                      .where('user_id', user.id)
                                      .fetch()

      const data = items.toJSON().map((item)=> item.books)

      return response.status(200).json({
        success: true,
        messages: "users favorite books populated",
        data: data
      })

    }catch(error){
      console.log(error)
      return response.status(500).json({
        success: false,
        messages: "could not populate user's favorite books.",
      })
    }

  }

  async addToFavorite ({ request, auth, response}){
    const { book_id } = request.all()

    try{
      const user = await auth.authenticator('jwt').getUser()

      const result = await Favorite.query()
                                       .where('book_id', Number(book_id))
                                       .where('user_id', user.id)
                                       .fetch()

      const isFavExist = result.toJSON()

      if(isFavExist.length !== 0){
        return response.status(304).json({
          message: "Favorite Item already exist",
          success:false
        })
      }

      await Favorite.create(
        {
          user_id: user.id,
          book_id: book_id
        })

      const existItems = await Favorite.query()
                                          .with('books', builder => {
                                                          builder.select([
                                                                        'id',
                                                                        'name',
                                                                        'cover_images',
                                                                        'price',
                                                                        'author'
                                                                      ])
                                                                      .with('book_author')})
                                          .where('user_id', user.id)
                                          .fetch()

        const data = existItems.toJSON().map(item => item.books)

        return response.status(200).json({
          success: false,
          messages: "Favorite books populated successfully",
          data:data
        })
    }catch(error){
      console.log(error)
      return response.status(500).json({
        success: false,
        messages: "could not add book to user's favorite",
        devMessage:error.message
      });
    }
  }

  async removeFromFavorite({ params , auth, response }){

    const  book_id    = Number(params.id)

    try{
      const user = await auth.authenticator('jwt').getUser()
       await Favorite.query()
                    .where('user_id', user.id)
                    .where('book_id', book_id)
                    .delete()

      const items = await Favorite.query()
                                       .with('books', builder => {
                                          builder.select(['id', 'name', 'cover_images', 'price', 'author'])
                                          .with('book_author') }
                                        )
                                      .where('user_id', user.id)
                                      .fetch()

      const data = items.toJSON().map((item)=> item.books)


      return response.status(200).json({
        success: true,
        messages: "Favorite book deleted successfully",
        data: data
      })

    }catch(error){
      console.log(error)
      return response.status(500).json({
        success: false,
        messages: "could not add book to user's favorite",
      });
    }
  }
}

module.exports = FavoriteController
