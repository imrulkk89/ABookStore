'use strict'

/*
|--------------------------------------------------------------------------
| DeliveryMethodSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class DeliveryMethodSeeder {
  async run () {


    await Factory.model('App/Models/DeliveryMethod').createMany(2, [
      {
        delivery_name: 'standard',
        delivery_time: 7,
        price: 10,
      },
      {
        delivery_name: 'express',
        delivery_time: 1,
        price: 30,
      }
    ])

  }
}

module.exports = DeliveryMethodSeeder
