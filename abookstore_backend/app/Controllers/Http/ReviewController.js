'use strict'

const Review = use('App/Models/Review')
const Database = use('Database')
class ReviewController {

  async create({request, auth, response}){

      const reviewData = request.all();
    try{
      const user = await auth.authenticator('jwt').getUser()

      reviewData.reviewer_id    = user.id
      reviewData.reviewer_name  = `${user.first_name} ${user.last_name}`
      reviewData.reviewer_email = user.email
      reviewData.review_date    = new Date()

      await Review.create(reviewData)

      const allReview = await Review.query().where('book_id', reviewData.book_id).fetch()

      const rating = await Database.raw('SELECT ROUND(SUM(reviewer_rating)/COUNT(id),2)  AS avg_review FROM  reviews where book_id=?',[request.body.book_id]);
      const avgRate = rating[0][0].avg_review

      await Database.table('books').where('id',reviewData.book_id).update('rating', avgRate);

      return response.status(200).json({
        success: true,
        messages: "Review created successfully",
        data: allReview.toJSON()
      })
    }catch(error){
      console.log(error)
      return response.status(500).json({
        success: false,
        messages: "could not save review"
    })

    }
  }
}

module.exports = ReviewController
