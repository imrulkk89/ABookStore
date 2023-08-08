'use strict'
const BookCover = use('App/Models/BookCover')
const Book      = use('App/Models/Book')

class BookCoverController {

  async getBookCoversList({ response }) {

    const book_covers = await BookCover.all();

    return response.status(200).json({
      status: true,
      message: "All book cover list populated",
      data: book_covers.toJSON()
    });
  }

  async getBooks({ params, response }) {
    const { id, page, show } = params;

    try {
      const maxPrice = await Book.query()
                                 .where("isDeleted", false)
                                 .where("language", id)
                                 .max("price as maxPrice")

      const minPrice = await Book.query()
                                 .where("isDeleted", false)
                                 .where("language", id)
                                 .min('price as minPrice')

      const book_cover_books = await BookCover.query()
        .with("books", builder => {
          builder
            .select([
              "id",
              "name",
              "cover_images",
              "page_number",
              "short_description",
              "long_description",
              "rating",
              "price",
              "discount",
              "stock",
              "slug",
              "status",
              "category",
              "stage",
              "discipline",
              "author",
              "publisher",
              "publishing_year",
             // "book_cover",
              "language"
            ])
            .with("book_author")
            .with("book_discipline")
            .with("book_language")
            .with("book_publisher")
            .with("book_publishing_year")
            // .with("book_covers")
            .with("book_stage")
            .forPage(page, show);
        })
        .where("id", id)
        .fetch();

      const _books = book_cover_books.toJSON()
      const total_books = _books[0].total_books

      const data = _books.map(item => item.books)

      return response.status(200).json({
        status: true,
        message: "Books in this book cover found.",
        page: Number(page),
        show: Number(show),
        total: total_books,
        totalPage: Math.ceil(total_books / show),
        price: [...maxPrice, ...minPrice],
        data: [...data[0]]
      })

    } catch (error) {
      console.log(error)
      return response.status(204).json({
        success: false,
        message: "No books found in this book cover"
      });
    }
  }
}

module.exports = BookCoverController
