'use strict'

class ProductStore {
  get rules () {
    return {
      // validation rules
      product_title: 'required',
      short_description: 'required',
      category: 'required',
      sub_category: 'required',
      price: 'required',
      product_status: 'required',
      author: 'required',
      discipline: 'required',
      publisher: 'required',
      publishing_year: 'required',
      language: 'required',
      page_number: 'required'
    }
  }

  get messages(){
    return {
      'product_title.required': 'Title Required!',
      'short_description.required': 'Short Description Required!',
      'price.required': 'Price Required',
      'product_status.required': 'Status Required',
      'author.required': 'Author Name Required',
      'discipline.required': 'Discipline Required',
      'publisher.required': 'Publisher Required',
      'publishing_year.required': 'Publish Year Required',
      'language.required': 'Language Required',
      'page_number.required': 'Page Number Required'
    }
  }

  async fails(errorMessage){
    this.ctx.session.withErrors(errorMessage).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = ProductStore
