'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

  address(){
    return this.belongsTo('App/Models/Address', 'address_id', 'id')
  }

  delivery(){
    return this.belongsTo('App/Models/DeliveryMethod', 'delivery_method', 'id')
  }

 /*  payment(){
    return this.belongsTo('App/Models/Payment', 'payment_id', 'id')
  } */

  promo(){
    return this.belongsTo('App/Models/PromoCode', 'promo_id', 'id')
  }

  books(){
    return this.hasMany('App/Models/BookOrder', 'id', 'order_id')
  }
}

module.exports = Order
