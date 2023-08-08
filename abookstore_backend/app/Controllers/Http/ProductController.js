"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Drive = use("Drive");
const {shuffle} = use("App/Helpers");
const getStream = use("get-stream");
const Sharp = require("sharp");

const Database = use("Database");
const Category = use("App/Models/Category");
const Author = use("App/Models/Author");
const Discipline = use("App/Models/Discipline");
const Stage = use("App/Models/Stage");
const Publisher = use("App/Models/Publisher");
const PublishingYear = use("App/Models/PublishingYear");
const Language = use("App/Models/Language");
const BookCover = use("App/Models/BookCover");
const Book = use("App/Models/Book");
const PromoCode = use("App/Models/PromoCode");
const logger = use("Logger");

/**
 * Resourceful controller for interacting with products
 */

class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({view, request, params, session, response}) {
    const {category_id} = request.all();
    let page = Number(params.page) || 1;
    let show = Number(params.show) || 10;
    let books = null;

    try {
      const categories = await Category.all();
      const allBooks = await Book.query()
        .where("isDeleted", false)
        .getCount("id");
      const allTrash = await Book.query()
        .where("isDeleted", true)
        .getCount("id");
      const available = await Book.query().where("status", 1).getCount("id");
      const UnAvailable = await Book.query().where("status", 0).getCount("id");
      let totalPage = null;

      if (category_id) {
        books = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .where("category", category_id)
          .forPage(page, show)
          .fetch();
        totalPage = Math.ceil(allBooks / show);

        session.put("category_id", category_id);
        session.flashAll();
      } else {
        books = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .forPage(page, show)
          .fetch();
        totalPage = Math.ceil(allBooks / show);
        session.put("category_id", "");
        session.flashAll();
      }

      session.flash({notification_success: "Book populated successfully."});
      session.flashAll();
      return view.render("product.all_product", {
        title: "All Product",
        product: true,
        allProducts: true,
        books: books.toJSON(),
        categories: categories.toJSON(),
        allBook: allBooks,
        allTrash: allTrash,
        page: page,
        totalPage: totalPage,
        available: available,
        UnAvailable: UnAvailable,
      });
    } catch (error) {
      logger.error(error);
      session.flash({notification_failure: "Failed to delete book"});
      session.flashAll();
      return view.render("product.all_product", {
        product: true,
        allProducts: true,
        books: [],
      });
    }
  }

  /**
   * Render a form to be used for creating a new product.
   * GET products/create
   *
   * @param {object} ctx
   * @param {View} ctx.view
   */
  async create({view}) {
    const categories = await Category.all();
    const authors = await Author.all();
    const disciplines = await Discipline.all();
    const stages = await Stage.all();
    const publishers = await Publisher.all();
    const publishing_years = await PublishingYear.all();
    const languages = await Language.all();
    const promo_codes = await PromoCode.all();
    //const book_covers       = await BookCover.all()

    return view.render("product.new_product", {
      title: "Create New Product",
      product: true,
      newProduct: true,
      categories: categories.toJSON(),
      authors: authors.toJSON(),
      disciplines: disciplines.toJSON(),
      stages: stages.toJSON(),
      publishers: publishers.toJSON(),
      publishing_years: publishing_years.toJSON(),
      languages: languages.toJSON(),
      promo_codes: promo_codes.toJSON(),
      //book_covers       : book_covers.toJSON()
    });
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({request, session, response}) {
    const bookData = {};

    request.multipart.field((name, value) => {
      bookData[name] = value;
    });

    const imagePaths = [];
    const books = {
      audiobook_file: "",
      epub_file: "",
      pdf_file: "",
    };

    for (let i = 0; i < 3; i++) {
      let transform = Sharp();
      request.multipart.file(
        "cover_images[" + i + "]",
        {types: ["image"], size: "19mb"},
        async (file) => {
          try {
            const ContentType = file.headers["content-type"];
            const ACL = "public-read";
            const Key = `${(Math.random() * 100).toString(32)}-${
              file.clientName
            }`;

            const data = await transform
              .resize({height: 1000})
              .jpeg({
                quality: 100,
                chromaSubsampling: "4:4:4",
              })
              .toFormat("jpeg");

            file.stream.pipe(transform).pipe(data);

            const url = await Drive.put(Key, data, {
              ContentType,
              ACL,
            });
            imagePaths.push(url);
          } catch (error) {
            logger.error(error);
            session.flash({
              notification_failure: "Failed to add book. Server error",
            });
            session.flashAll();
            return response.redirect("back");
          }
        }
      );
    }

    request.multipart.file("pdf_file", {}, async (file) => {
      const ContentType = file.headers["content-type"];
      const ACL = "public-read";
      const Key = `pdf-${Date.now()}-${file.clientName}`;

      const url = await Drive.put(Key, file.stream, {
        ContentType,
        ACL,
      });      
      books["pdf_file"] = url;
    });

    request.multipart.file("epub_file", {}, async (file) => {
      const ContentType = file.headers["content-type"];
      const ACL = "public-read";
      const Key = `epub-${Date.now()}-${file.clientName}`;

      const url = await Drive.put(Key, file.stream, {
        ContentType,
        ACL,
      });
      
      books["epub_file"] = url;
    });

    request.multipart.file("audiobook_file", {}, async (file) => {
      const ContentType = file.headers["content-type"];
      const ACL = "public-read";
      const Key = `audiobook-${Date.now()}-${file.clientName}`;

      const url = await Drive.put(Key, file.stream, {
        ContentType,
        ACL,
      });
     
      books["audiobook_file"] = url;   
    });

    try {
      await request.multipart.process();
    } catch (error) {
      logger.error(error);
      session.flash({
        notification_failure: "Failed to add book. Server error",
      });
      session.flashAll();
      return response.redirect("back");
    }

    try {
      if (bookData.sales_price && bookData.sales_price.includes("%")) {
        let salesValueArray = bookData.sales_price.split("%");
        if (parseInt(salesValueArray[0]) >= 100) {
          session.flash({
            notification_failure:
              "Failed to add book. Sales Percent Value bigger than 100%",
          });
          session.flashAll();         
          return response.redirect("back");
        }
        bookData.sales_price = String(bookData.sales_price);
      } else {
        if (bookData.sales_price && parseInt(bookData.sales_price) > parseInt(bookData.price)) {
          session.flash({
            notification_failure:
              "Failed to add book. Sales Price bigger than Regular Price",
          });
          session.flashAll();         
          return response.redirect("back");
        }
        
        if(bookData.sales_price) 
          bookData.sales_price = Number(bookData.sales_price);
      }

      if (books.audiobook_file && !bookData.price_audiobook) {
        session.flash({
          notification_failure: "Failed to add book. Audiobook price wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      } else if (!books.audiobook_file && bookData.price_audiobook && parseInt(bookData.price_audiobook) > 0) {
        session.flash({
          notification_failure: "Failed to add book. Audiobook file wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      }

      if (books.epub_file && !bookData.price_epub) {
        session.flash({
          notification_failure: "Failed to add book. EPUB price wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      } else if (!books.epub_file && bookData.price_epub && parseInt(bookData.price_epub) > 0) {
        session.flash({
          notification_failure: "Failed to add book. EPUB file wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      }

      if (books.pdf_file && !bookData.price_pdf) {
        session.flash({
          notification_failure: "Failed to add book. PDF price wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      } else if (!books.pdf_file && bookData.price_pdf && parseInt(bookData.price_pdf) > 0) {
        session.flash({
          notification_failure: "Failed to add book. PDF file wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      }

                

      bookData.name = bookData.product_title;
      bookData.category = Number(bookData.category);
      bookData.status = Number(bookData.product_status);
      bookData.page_number = Number(bookData.page_number);
      bookData.price_hardcover = Number(bookData.price_hardcover);
      bookData.price_audiobook = Number(bookData.price_audiobook);
      bookData.price_epub = Number(bookData.price_epub);
      bookData.price_pdf = Number(bookData.price_pdf);
      bookData.price = bookData.price ? Number(bookData.price) : null;
      bookData.sales_price_hardcover = Number(bookData.sales_price_hardcover);
      bookData.sales_price_audiobook = Number(bookData.sales_price_audiobook);
      bookData.sales_price_epub = Number(bookData.sales_price_epub);
      bookData.sales_price_pdf = Number(bookData.sales_price_pdf);
      bookData.promo_code = bookData.promo_code || null;
      bookData.tags = String(bookData.tags);
      bookData.stock = Number(bookData.stock);
      bookData.author = await Author.add(bookData.author);
      bookData.discipline = await Discipline.add(bookData.discipline);
      bookData.stage = Number(bookData.stage);
      bookData.publisher = await Publisher.add(bookData.publisher);
      bookData.publishing_year = await PublishingYear.add(
        bookData.publishing_year
      );
      bookData.language = await Language.add(bookData.language);
      // bookData.book_cover = await BookCover.add(bookData.book_cover)

      delete bookData.product_status;
      delete bookData.product_title;
      delete bookData._csrf;

      const bookCovers = {
        img_1: imagePaths[0],
        img_2: imagePaths[1],
        img_3: imagePaths[2],
      };

      bookData.cover_images = JSON.stringify(bookCovers);
      bookData.book_files = JSON.stringify(books);

      //Calulating Discount
      if(bookData.sales_price_hardcover > 0){

        bookData.discount = ((bookData.price_hardcover - bookData.sales_price_hardcover) * 100 ) / bookData.price_hardcover;
        bookData.discount_type = 'HARD_COVER';

      }else if(bookData.sales_price_pdf > 0){

        bookData.discount = ((bookData.price_pdf - bookData.sales_price_pdf) * 100 ) / bookData.price_pdf;
        bookData.discount_type = 'PDF';

      }else if(bookData.sales_price_epub > 0){

        bookData.discount = ((bookData.price_pdf - bookData.sales_price_epub) * 100 ) / bookData.price_pdf;
        bookData.discount_type = 'EPUB';

      }else if(bookData.sales_price_audiobook > 0){

        bookData.discount = ((bookData.price_audiobook - bookData.sales_price_audiobook) * 100 ) / bookData.price_audiobook;
        bookData.discount_type = 'AUDIO';
      }

    } catch (error) {
      logger.error(error);
      session.flash({
        notification_failure: "Failed to add book. Server Error",
      });
      session.flashAll();
      return response.redirect("back");
    }

    try {
      await Book.create(bookData);
      await Author.updateBookCount(bookData.author);
      await Discipline.updateBookCount(bookData.discipline);
      await Language.updateBookCount(bookData.language);
      // await BookCover.updateBookCount(bookData.book_cover)
      await Publisher.updateBookCount(bookData.publisher);
      await PublishingYear.updateBookCount(bookData.publishing_year);
      await Stage.updateBookCount(bookData.stage);

      session.flash({notification_success: "Book added successfully."});
      return response.redirect("/admin/product/create");
    } catch (error) {
      logger.error(error);
      session.flash({
        notification_failure: "Failed to add book. Server Error",
      });
      session.flashAll();
      return response.redirect("back");
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({params, request, response, view}) {
  }

  /**
   * Render a form to update an existing product.
   * GET products/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */
  async edit({params, response, view}) {
    try {
      const book = await Book.query()
        .with("book_category")
        .with("book_author", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_discipline", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_language", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_publisher", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_publishing_year", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_review")
        .where("id", params.id)
        .fetch();

      const categories = await Category.all();
      const authors = await Author.all();
      const disciplines = await Discipline.all();
      const publishers = await Publisher.all();
      const publishing_years = await PublishingYear.all();
      const languages = await Language.all();
      const promo_codes = await PromoCode.all();

      return view.render("product.single_product", {
        book: book.rows[0].toJSON(),
        categories: categories.toJSON(),
        authors: authors.toJSON(),
        disciplines: disciplines.toJSON(),
        publishers: publishers.toJSON(),
        publishing_years: publishing_years.toJSON(),
        languages: languages.toJSON(),
        promo_codes: promo_codes.toJSON(),
      });
    } catch (error) {
      logger.error(error);
      return response.redirect("back");
    }
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({params, request, session, response}) {
    const data = {};

    const bookData = await Book.find(params.id);

    request.multipart.field((name, value) => {
      data[name] = value;
    });

    const images = JSON.parse(bookData.cover_images) || {};
    const book_files = JSON.parse(bookData.book_files) || {};

    for (let i = 0; i < 3; i++) {
      let transform = Sharp();

      request.multipart.file(
        "cover_images[" + i + "]",
        {types: ["image"], size: "19mb"},
        async (file) => {
          try {
            const ContentType = file.headers["content-type"];
            const ACL = "public-read";
            const Key = `${(Math.random() * 100).toString(32)}-${
              file.clientName
            }`;

            const data = await transform
              .resize({height: 1000})
              .jpeg({
                quality: 90,
                chromaSubsampling: "4:4:4",
              })
              .toFormat("jpeg");

            file.stream.pipe(transform).pipe(data);

            const url = await Drive.put(Key, data, {
              ContentType,
              ACL,
            });

            switch (i) {
              case 0:
                //await Drive.delete(images.img_1.slice(52))
                images.img_1 = url;
                break;
              case 1:
                //await Drive.delete(images.img_2.slice(52))
                images.img_2 = url;
                break;
              case 2:
                //await Drive.delete(images.img_3.slice(52))
                images.img_3 = url;
                break;
              default:
            }
          } catch (error) {
            session.flash({
              notification_failure: "Failed to add book. Server error",
            });
            session.flashAll();
            return response.redirect("back");
          }
        }
      );
    }

    request.multipart.file("pdf_file", {}, async (file) => {
      const ContentType = file.headers["content-type"];
      const ACL = "public-read";
      const Key = `pdf-${Date.now()}-${file.clientName}`;

      const url = await Drive.put(Key, file.stream, {
        ContentType,
        ACL,
      });
      book_files.pdf_file = url;
    });

    request.multipart.file("epub_file", {}, async (file) => {
      const ContentType = file.headers["content-type"];
      const ACL = "public-read";
      const Key = `epub-${Date.now()}-${file.clientName}`;

      const url = await Drive.put(Key, file.stream, {
        ContentType,
        ACL,
      });
      book_files.epub_file = url;
    });

    request.multipart.file("audiobook_file", {}, async (file) => {
      const ContentType = file.headers["content-type"];
      const ACL = "public-read";
      const Key = `audiobook-${Date.now()}-${file.clientName}`;

      const url = await Drive.put(Key, file.stream, {
        ContentType,
        ACL,
      });
      book_files.audiobook_file = url;
    });

    try {
      await request.multipart.process();
    } catch (error) {
      session.flash({
        notification_failure: "Failed to add book. Server error",
      });
      session.flashAll();
      return response.redirect("back");
    }

    if (data.delete_img_1 !== undefined) {
      //await Drive.delete(images.img_1.slice(52))
      delete images.img_1;
    }

    if (data.delete_img_2 !== undefined) {
      //await Drive.delete(images.img_2.slice(52))
      delete images.img_2;
    }

    if (data.delete_img_3 !== undefined) {
      //await Drive.delete(images.img_3.slice(52))
      delete images.img_3;
    }

    if (data.sales_price && data.sales_price.includes("%")) {
      let salesValueArray = data.sales_price.split("%");
      
      if (parseInt(salesValueArray[0]) >= 100) {
        session.flash({
          notification_failure:
            "Failed to add book. Sales Percent Value bigger than 100%",
        });
        session.flashAll();
        return response.redirect("back");
      }
      if(data.sales_price) 
        bookData.sales_price = String(data.sales_price);
    } else {
      if (data.sales_price && parseInt(data.sales_price) > parseInt(data.price)) {
        session.flash({
          notification_failure:
            "Failed to add book. Sales Price bigger than Regular Price",
        });
        session.flashAll();
        return response.redirect("back");
      }

      if(data.sales_price) 
        bookData.sales_price = Number(data.sales_price);
    }

    //Audio Book checking section
    if(book_files.audiobook_file || parseInt(data.price_audiobook) !== 0){

      if (book_files.audiobook_file && parseInt(data.price_audiobook) === 0){
        session.flash({
          notification_failure: "Failed to add book. Audiobook price wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      } else if (!book_files.audiobook_file && parseInt(data.price_audiobook) > 0){
        session.flash({
          notification_failure: "Failed to add book. Audiobook file wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      }
    }
    //End of Audio Book checking section

    
    //EPUB Book checking Section
    if(book_files.epub_file || parseInt(data.price_epub) !== 0){ 

      if (book_files.epub_file && parseInt(data.price_epub) === 0) {
        session.flash({
          notification_failure: "Failed to add book. EPUB price wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      } else if (!book_files.epub_file && parseInt(data.price_epub) > 0) {
        session.flash({
          notification_failure: "Failed to add book. EPUB file wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      }
    }
    //End of EPUB Book checking Section

    //PDF file checking section
    if(book_files.pdf_file || parseInt(data.price_pdf) !== 0){

      if (book_files.pdf_file && parseInt(data.price_pdf) === 0) {
        session.flash({
          notification_failure: "Failed to add book. PDF price wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      } else if ( !book_files.pdf_file && parseInt(data.price_pdf) > 0) {
        session.flash({
          notification_failure: "Failed to add book. PDF file wanted.",
        });
        session.flashAll();
        return response.redirect("back");
      }
    }
    //End PDF file checking section
    

    bookData.name = data.product_title;
    bookData.short_description = data.short_description;
    bookData.long_description = data.long_description;
    bookData.category = Number(data.category);
    bookData.status = Number(data.product_status);
    bookData.page_number = Number(data.page_number);
    bookData.price_hardcover = Number(data.price_hardcover);
    bookData.price_audiobook = Number(data.price_audiobook);
    bookData.price_epub = Number(data.price_epub);
    bookData.price_pdf = Number(data.price_pdf);
    bookData.price = bookData.price ? Number(bookData.price) : null;
    bookData.sales_price_hardcover = Number(data.sales_price_hardcover);
    bookData.sales_price_audiobook = Number(data.sales_price_audiobook);
    bookData.sales_price_epub = Number(data.sales_price_epub);
    bookData.sales_price_pdf = Number(data.sales_price_pdf);
    bookData.tags = String(data.tags);
    bookData.stock = Number(data.stock);
    bookData.author = await Author.add(data.author);
    bookData.discipline = await Discipline.add(data.discipline);
    bookData.stage = Number(data.stage);
    bookData.publisher = await Publisher.add(data.publisher);
    bookData.publishing_year = await PublishingYear.add(data.publishing_year);
    bookData.language = await Language.add(data.language);
    // bookData.book_cover = await BookCover.add(data.book_cover);

    if(images)
      bookData.cover_images = JSON.stringify(images);

    if(book_files) 
      bookData.book_files = JSON.stringify(book_files);

    //Calulating Discount
    if(bookData.sales_price_hardcover > 0){

      bookData.discount = ((bookData.price_hardcover - bookData.sales_price_hardcover) * 100 ) / bookData.price_hardcover;
      bookData.discount_type = 'HARD_COVER';

    }else if(bookData.sales_price_pdf > 0){

      bookData.discount = ((bookData.price_pdf - bookData.sales_price_pdf) * 100 ) / bookData.price_pdf;
      bookData.discount_type = 'PDF';

    }else if(bookData.sales_price_epub > 0){

      bookData.discount = ((bookData.price_pdf - bookData.sales_price_epub) * 100 ) / bookData.price_pdf;
      bookData.discount_type = 'EPUB';

    }else if(bookData.sales_price_audiobook > 0){

      bookData.discount = ((bookData.price_audiobook - bookData.sales_price_audiobook) * 100 ) / bookData.price_audiobook;
      bookData.discount_type = 'AUDIO';
    }  

    try {
      bookData.save();
      session.flash({notification_success: "Book updated successfully."});
      return response.redirect(`/admin/product/${bookData.id}/edit`);
    } catch (error) {
      logger.error(`ProductController::update - ${error}`);
      session.flash({notification_failure: "Failed to update Book"});
      return response.redirect("back");
    }
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({params, request, response, session}) {
    const {id} = params;
    try {
      const bookData = await Book.find(id);

      await Book.query().where("id", id).update({isDeleted: true});

      await Author.decreaseBookCount(bookData.author);
      await Discipline.decreaseBookCount(bookData.discipline);
      await Language.decreaseBookCount(bookData.language);
      await Publisher.decreaseBookCount(bookData.publisher);
      await PublishingYear.decreaseBookCount(bookData.publishing_year);
      await Stage.decreaseBookCount(bookData.stage);
      await BookCover.decreaseBookCount(bookData.book_cover);

      session.flash({
        notification_success:
          "Book deleted successfully. It will be found in trash",
      });
      return response.redirect("back");
    } catch (error) {
      session.flash({notification_failure: "Failed to delete book"});
      return response.redirect("back");
    }
  }

  async trash({request, view, params, session}) {
    const {category_id} = request.all();

    let page = Number(params.page) || 1;
    let show = Number(params.show) || 10;
    let books = null;

    try {
      const categories = await Category.all();
      const allBooks = await Book.query()
        .where("isDeleted", false)
        .getCount("id");
      const allTrash = await Book.query()
        .where("isDeleted", true)
        .getCount("id");
      const available = await Book.query().where("status", 1).getCount("id");
      const UnAvailable = await Book.query().where("status", 0).getCount("id");
      let totalPage = 1;
      if (category_id) {
        books = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("category", category_id)
          .where("isDeleted", true)
          .forPage(page, show)
          .fetch();
        totalPage = Math.ceil(allTrash / show);
        session.put("category_id", category_id);
        session.flashAll();
      } else {
        books = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", true)
          .forPage(page, show)
          .fetch();
        totalPage = Math.ceil(allTrash / show);
        session.put("category_id", "");
        session.flashAll();
      }

      session.flash({notification_success: "Book populated successfully."});
      session.flashAll();
      return view.render("product.trash", {
        product: true,
        allProducts: true,
        books: books.toJSON(),
        categories: categories.toJSON(),
        allBook: allBooks,
        allTrash: allTrash,
        page: page,
        totalPage: totalPage,
        available: available,
        UnAvailable: UnAvailable,
      });
    } catch (error) {
      session.flash({notification_failure: "Trash book populated failed"});
      session.flashAll();
      return view.render("product.trash", {
        product: true,
        allProducts: true,
        books: [],
      });
    }
  }

  async trashAll({request, view, params, session, response}) {
    try {
      const all_id = request.body[0];
      const book = await Book;
      const deletes = all_id.map(
        async (id) =>
          await book.query().where("id", id).update({isDeleted: true})
      );
      if (deletes)
        return response.status(200).json({
          message: "Delete all successfully",
          success: true,
        });
    } catch (error) {
      return response.status(500).json({
        message: "Server Error Occurred",
        success: false,
      });
    }
  }

  async restoreFromTrash({params, response, session}) {
    const {id} = params;
    try {
      const bookData = await Book.find(id);
      await Book.query().where("id", id).update({isDeleted: false});

      await Author.updateBookCount(bookData.author);
      await Discipline.updateBookCount(bookData.discipline);
      await Language.updateBookCount(bookData.language);
      await Publisher.updateBookCount(bookData.publisher);
      await PublishingYear.updateBookCount(bookData.publishing_year);
      await Stage.updateBookCount(bookData.stage);
      await BookCover.updateBookCount(bookData.book_cover);

      session.flash({
        notification_success:
          "Book restored successfully. It will be found in all product page",
      });
      return response.redirect("back");
    } catch (error) {
      session.flash({notification_failure: "Failed to restore book"});
      return response.redirect("back");
    }
  }

  async restoreAllFromTrash({request, response, session}) {
    try {
      const all_id = request.body[0];
      const book = await Book;
      const restore = all_id.map(
        async (id) =>
          await book.query().where("id", id).update({isDeleted: false})
      );
      if (restore)
        return response.status(200).json({
          message: "Restore all successfully",
          success: true,
        });
    } catch (error) {
      return response.status(500).json({
        message: "Server Error Occurred",
        success: false,
      });
    }
  }

  async permanentlyDelete({params, session, response}) {
    const {id} = params;
    try {
      await Book.query().where("id", id).delete();
      session.flash({notification_success: "Book Deleted successfully."});
      session.flashAll();
      return response.redirect("back");
    } catch (error) {
      session.flash({notification_failure: "Failed to delete book"});
      session.flashAll();
      return response.redirect("back");
    }
  }

  /**
   * Show a list of all categories for API.
   * GET all books
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async allBooks({params, response}) {
    const {page, show, keyword} = params;
    try {
      if (!keyword) {
        const books = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .forPage(page, show)
          .fetch();

        const total_book = await Book.query().where("isDeleted", false).fetch();
        let totalPage =
          Number(show) === 1
            ? Math.ceil(total_book.rows.length / 5)
            : Math.ceil(total_book.rows.length / Number(show));

        return response.status(200).json({
          page: page,
          show: show,
          total: total_book.rows.length,
          totalPage: totalPage,
          data: books,
        });
      }

      if (keyword) {
        let searchKey = `${decodeURIComponent(keyword)}`;
        const data = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .whereRaw("MATCH(name, tags)  AGAINST (?)", [searchKey.toLowerCase()])
          //.orWhere("tags", "like", searchKey.toLowerCase())
          //.orWhere("category", "like", searchKey.toLowerCase())
          //.forPage(page, show)
          .fetch();

        const total_book = data.toJSON();
        let totalPage =
          Number(show) === 1
            ? Math.ceil(total_book.length / 5)
            : Math.ceil(total_book.length / Number(show));
        if (!data) {
          return response.status(203).json({
            messages: "Book Not found",
            success: false,
          });
        } else {
          return response.status(201).json({
            success: true,
            messages: "requested category books populated successfully.",
            page: page,
            show: show,
            total: total_book.length,
            totalPage: totalPage,
            data: data,
          });
        }
      }
    } catch (ex) {
      return response.status(500).json({
        success: false,
        messages: "could not populate all books.",
      });
    }
  }

  /**
   * Show data of a single book.
   * GET single book
   *
   * @param {object} ctx
   * @param {Request} ctx.params
   * @param {Response} ctx.response
   */

  async getSingleBook({params, response}) {
    try {
      const book = await Book.query()
        .with("book_category")
        .with("book_author", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_discipline", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_language", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_publisher", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_publishing_year", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_stage", (builder) => {
          return builder.select(["id", "stage"]);
        })
        .with("book_review")
        .where("id", params.id)
        .fetch();

      const review = await Database.raw(
        "SELECT COUNT(id) AS book_review FROM  reviews WHERE book_id = ?",
        [params.id]
      );
      const similarBooks = await Book.query()
        .with("book_author", (builder) => {
          return builder.select(["id", "name"]);
        })
        .where("category", book.rows[0].category)
        .fetch();

      return response.status(200).json({
        success: true,
        messages: "requested book populated successfully.",
        data: {
          ...book.rows[0].toJSON(),
          total_review: review[0][0].book_review,
        },
        similar: shuffle(similarBooks.rows),
      });
    } catch (ex) {
      return response.status(500).json({
        success: false,
        messages: "could not populate requested book.",
      });
    }
  }

  /**
   * Show a all books of specific category.
   * GET book by category
   *
   * @param {object} ctx
   * @param {Request} ctx.params
   * @param {Response} ctx.response
   */

  async categoryBooks({params, response}) {
    const {page, show, id} = params;

    try {
      let book;
      let total_book;

      if (id === "all") {
        book = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .forPage(page, show)
          .fetch();

        total_book = await Book.query().where("isDeleted", false).getCount();
      } else {
        book = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .where("category", id)
          .forPage(page, show)
          .fetch();

        total_book = await Book.query()
          .where("isDeleted", false)
          .where("category", id)
          .getCount();
      }

      return response.status(200).json({
        success: true,
        messages: "requested category books populated successfully.",
        page: page,
        show: show,
        total: total_book,
        totalPage: Math.ceil(total_book / show),
        data: book,
      });
    } catch (ex) {
      return response.status(500).json({
        success: false,
        messages: "could not populate requested category books.",
      });
    }
  }

  async price_range({params, response}) {
    const {type, type_id, page, show, lowPrice, highestPrice} = params;
    let data = [];
    try {
      const total_book = await Book.query().where("isDeleted", false).fetch();
      if (!type)
        data = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .whereBetween("price", [lowPrice, highestPrice])
          .forPage(page, show)
          .fetch();

      if (type === "stage") {
        data = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("stage", type_id)
          .where("isDeleted", false)
          .whereBetween("price", [lowPrice, highestPrice])
          .forPage(page, show)
          .fetch();
      }
      if (type === "discipline") {
        data = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("discipline", type_id)
          .where("isDeleted", false)
          .whereBetween("price", [lowPrice, highestPrice])
          .forPage(page, show)
          .fetch();
      }
      if (type === "author") {
        data = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("author", type_id)
          .where("isDeleted", false)
          .whereBetween("price", [lowPrice, highestPrice])
          .forPage(page, show)
          .fetch();
      }
      if (type === "publisher") {
        data = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("publisher", type_id)
          .where("isDeleted", false)
          .whereBetween("price", [lowPrice, highestPrice])
          .forPage(page, show)
          .fetch();
      }
      if (type === "publishing-year") {
        data = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("publishing_year", type_id)
          .where("isDeleted", false)
          .whereBetween("price", [lowPrice, highestPrice])
          .forPage(page, show)
          .fetch();
      }
      if (type === "language") {
        data = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("language", type_id)
          .where("isDeleted", false)
          .whereBetween("price", [lowPrice, highestPrice])
          .forPage(page, show)
          .fetch();
      }
      return response.status(201).json({
        success: true,
        messages: "requested category books populated successfully.",
        page: params.page,
        show: params.show,
        total: total_book.rows.length,
        totalPage: Math.ceil(total_book.rows.length / params.show),
        data: data,
      });
    } catch (error) {
      return response.status(200).json({
        success: false,
        message: "server error occurred",
      });
    }
  }

  async shortBy({params, response}) {
    const {show, page, query} = params;
    const decodedQuery = decodeURIComponent(query);
    const total_book = await Book.query().where("isDeleted", false).fetch();

    try {
      if (decodedQuery === "Price: low to high") {
        //  SELECT DISTINCT * FROM books ORDER BY rating DESC I follow this query
        const LowestPriceBooks = await Book.query()
          .distinct("*")
          .orderBy("price")
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .forPage(page, show)
          .fetch();

        return response.status(200).json({
          success: true,
          messages: "requested category books populated successfully.",
          page: page,
          show: show,
          total: total_book.rows.length,
          totalPage: Math.ceil(total_book.rows.length / show),
          data: LowestPriceBooks,
        });
      }
      if (decodedQuery === "Price: high to low") {
        const highestPriceBooks = await Book.query()
          .distinct("*")
          .orderBy("price", "desc")
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .forPage(page, show)
          .fetch();

        return response.status(200).json({
          success: true,
          messages: "requested category books populated successfully.",
          page: page,
          show: show,
          total: total_book.rows.length,
          totalPage: Math.ceil(total_book.rows.length / show),
          data: highestPriceBooks,
        });
      }

      if (decodedQuery === "New") {
        const newBooks = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .forPage(page, show)
          .orderBy("id", "desc")
          .fetch();

        response.status(200).json({
          success: true,
          messages: "requested category books populated successfully.",
          page: page,
          show: show,
          total: total_book.rows.length,
          totalPage: Math.ceil(total_book.rows.length / show),
          data: newBooks,
        });
      }
      if (decodedQuery === "Popular") {
        const highestPriceBooks = await Book.query()
          .distinct("*")
          .orderBy("rating", "desc")
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("isDeleted", false)
          .forPage(page, show)
          .fetch();

        return response.status(200).json({
          success: true,
          messages: "requested category books populated successfully.",
          page: page,
          show: show,
          total: total_book.rows.length,
          totalPage: Math.ceil(total_book.rows.length / show),
          data: highestPriceBooks,
        });
      }
    } catch (error) {
      logger.error(error);
      return response.status(500).json({
        message: "Serve error ocurred",
        status: false,
      });
    }
  }

  async getMaxAndMinPrice({response}) {
    try {
      const maxPrice = await Book.query()
        .where("isDeleted", false)
        .max("price as maxPrice");
      const minPrice = await Book.query()
        .where("isDeleted", false)
        .min("price as minPrice");
      return response.status(200).json({
        data: [...maxPrice, ...minPrice],
        message: "Max Price and Minimum price successfully populated",
        success: true,
      });
    } catch (error) {
      logger.error(error);
      return response.status(500).json({
        message: "Server error occurred",
        success: false,
      });
    }
  }

  async bookStatus({params, view, response}) {
    let page = Number(params.page) || 1;
    let show = Number(params.show) || 10;
    const categories = await Category.all();
    const allBooks = await Book.query()
      .where("isDeleted", false)
      .getCount("id");
    const allTrash = await Book.query().where("isDeleted", true).getCount("id");
    const available = await Book.query().where("status", 1).getCount("id");
    const UnAvailable = await Book.query().where("status", 0).getCount("id");
    let totalPage = null;
    let books = null;

    switch (params.type) {
      case "available":
        books = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("status", 1)
          .forPage(page, show)
          .fetch();
        totalPage = Math.ceil(allBooks / show);
        return view.render("product.all_product", {
          product: true,
          allProducts: true,
          books: books.toJSON(),
          categories: categories.toJSON(),
          allBook: allBooks,
          allTrash: allTrash,
          page: page,
          totalPage: totalPage,
          available: available,
          UnAvailable: UnAvailable,
        });

      case "unavailable":
        books = await Book.query()
          .with("book_category")
          .with("book_author", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_discipline", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_language", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publisher", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_publishing_year", (builder) => {
            return builder.select(["id", "name"]);
          })
          .with("book_stage", (builder) => {
            return builder.select(["id", "stage"]);
          })
          .where("status", 0)
          .forPage(page, show)
          .fetch();

        return view.render("product.all_product", {
          product: true,
          allProducts: true,
          books: books.toJSON(),
          categories: categories.toJSON(),
          allBook: allBooks,
          allTrash: allTrash,
          page: page,
          totalPage: totalPage,
          available: available,
          UnAvailable: UnAvailable,
        });
      default:
        return response.redirect("back");
    }
  }

  async searchBook({params, view, request, response}) {
    let page = Number(params.page) || 1;
    let show = Number(params.show) || 10;
    let books = null;
    const keyword = decodeURIComponent(request.body.query);

    try {
      const categories = await Category.all();

      const allBooks = await Book.query()
        .where("isDeleted", false)
        .getCount("id");

      const allTrash = await Book.query()
        .where("isDeleted", true)
        .getCount("id");

      const available = await Book.query().where("status", 1).getCount("id");

      const UnAvailable = await Book.query().where("status", 0).getCount("id");

      let totalPage = null;

      books = await Book.query()
        .with("book_category")
        .with("book_author", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_discipline", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_language", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_publisher", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_publishing_year", (builder) => {
          return builder.select(["id", "name"]);
        })
        .with("book_stage", (builder) => {
          return builder.select(["id", "stage"]);
        })
        .where("tags", `like`, `%${keyword}%`)
        .forPage(page, show)
        .fetch();

      totalPage = Math.ceil(allBooks / show);

      return view.render("product.all_product", {
        product: true,
        allProducts: true,
        books: books.toJSON(),
        categories: categories.toJSON(),
        allBook: allBooks,
        allTrash: allTrash,
        page: page,
        totalPage: totalPage,
        available: available,
        UnAvailable: UnAvailable,
      });
    } catch (error) {
      logger.error(error);
      return response.redirect("back");
    }
  }
}

module.exports = ProductController;
