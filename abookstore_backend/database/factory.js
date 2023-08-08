'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

 Factory.blueprint('App/Models/User', () => {
   return {
     first_name:'Super',
     last_name:'Admin',
     email: 'super@gmail.com',
     password: 'super123',
     user_type:'SUPER_ADMIN'
   }
})

Factory.blueprint('App/Models/DeliveryMethod', (faker, i, data) => {
  return {
    delivery_name: data[i].delivery_name,
    delivery_time: data[i].delivery_time,
    price: data[i].price

  }
})


