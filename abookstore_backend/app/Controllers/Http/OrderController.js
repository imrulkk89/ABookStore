'use strict'
const Database = use('Database')
const Address = use('App/Models/Address')
const Order = use('App/Models/Order')
const Book = use('App/Models/Book')
const BookOrder = use('App/Models/BookOrder')
const PromoCode = use('App/Models/PromoCode')
const Env = use('Env')
const Mail = use("Mail")
const { AfterPurchase, TrackOrderMailTemplate } = use('./EmailTemplate')


const voucher = require('voucher-code-generator')
const moment = require('moment')
//const axios     =   require('axios')
const util = require('util')
const { sha512 } = require('js-sha512')
const httpRequest = require('request')

//let MPESA_EXPIRE_TOKEN_TIME = 0
//let MPESA_AUTH_TOKEN = ''


const formRequest = util.promisify(httpRequest.post)

class OrderController {

  async index({ view, params, response }) {
    let page = Number(params.page) || 1;
    let show = Number(params.show) || 10;

    try {
      const orders = await Order.query()
        .with('address')
        .with('delivery')
        .with('promo')
        .with('books')
        .forPage(page, show)
        .fetch()

      const all_orders = orders.toJSON()
      const totalPage = Math.ceil(all_orders.length / show);
      // const created_order = await Order.query().where('status', 'CREATED').fetch()
      const pending_order = await Order.query().where('status', 'PENDING').fetch()
      const approved_order = await Order.query().where('status', 'APPROVED').fetch()
      const delivery_order = await Order.query().where('status', 'DELIVERY').fetch()
      const delivered_order = await Order.query().where('status', 'DELIVERED').fetch()
      const rejected_order = await Order.query().where('status', 'REJECTED').fetch()
      all_orders.map(item => {
        item.created_at = moment(item.created_at).format('MM/DD/YYYY hh:mm A')

        if (item.books.length !== 0) {
          const ordered_books = item.books
          let total_books = 0
          let total_price = 0
          ordered_books.map(book => {
            total_books += book.quantity
            total_price += book.quantity_price
          })

          item.total_books = total_books
          item.total_price = total_price

        }
      })

      return view.render('order.index', {
        title: "All orders",
        orders_nav: true,
        orders: all_orders,
        totalPage,
        page: page,
        pending_order: pending_order.toJSON().length !== 0 ? pending_order.toJSON().length : 0,
        approved_order: approved_order.toJSON().length !== 0 ? approved_order.toJSON().length : 0,
        delivery_order: delivery_order.toJSON().length !== 0 ? delivery_order.toJSON().length : 0,
        delivered_order: delivered_order.toJSON().length !== 0 ? delivered_order.toJSON().length : 0,
        rejected_order: rejected_order.toJSON().length !== 0 ? rejected_order.toJSON().length : 0,
      })

      /* return response.status(200).json({
        orders: all_orders
      }) */

    } catch (error) {
      console.log(error)
      return response.redirect('back')
    }
  }

  async store({ request, auth, response }) {
    const { address, payment, delivery, books, promo, orderRef } = request.all()

    try {
      const user = await auth.authenticator('jwt').getUser()

      delete address.policy
      delete address.terms
      const _address = await Address.create({ ...address, user_id: user.id })
      // const _payment = await Payment.findBy('card_number', payment.card_number)
      // const orderRef = `#${(voucher.generate({ length: 5, count: 1, charset: voucher.charset("alphanumeric") }).pop()).toUpperCase()}`

      const orderData = {
        order_code: orderRef,
        address_id: _address.id,
        delivery_method: delivery,
        payment: JSON.stringify(payment),
        promo_id: promo,
        paid: 1,
        // paid: payment.info.paid || false,
        status: 'PENDING'
      }

      /* if (payment.method === 'mpesa') {

        const isSuccess = await this.mpesaPayment({ ...payment.info, ref: orderRef })

        if (!isSuccess) {
          return response.status(400).json({
            success: false,
            messages: 'Mpesa payment not successful. Could not place order'
          })
        }
      } */

      const order = await Order.create(orderData)

      const book_ids = books.map(item => item.id)

      const _books = await Database.select(
        'books.id',
        'books.name',
        'books.price',
        'books.cover_images',
        'books.discount',
        'categories.category'
      )
        .from('books')
        .leftJoin('categories', 'books.category', 'categories.id')
        .whereIn('books.id', book_ids)

      let total_item = 0
      //add quntity to _books arr & count total item
      _books.map(b => {
        const bo = books.find(bk => b.id === bk.id)
        b.quantity = bo.quantity
        total_item += bo.quantity
      })


      const _book_ordered = []
      let total_price = 0
      let discount_price = 0

      _books.map(item => {
        books.map(book => {
          if (item.id === book.id) {
            _book_ordered.push({
              user_id: user.id,
              order_id: order.id,
              book_id: book.id,
              quantity: book.quantity,
              unit_price: item.price
            })
          }
        })
      })

      _book_ordered.map(item => {
        total_price = parseFloat(total_price + (item.quantity * item.unit_price))
      })

      await BookOrder.createMany(_book_ordered)

      discount_price = total_price

      if (promo) {
        const promoInfo = await PromoCode.findOrFail(promo)

        if (promoInfo) {
          const discount = promoInfo.discount
          const upto = promoInfo.upto

          if (Number(total_price) <= Number(upto)) {
            discount_price = Number(total_price) - Number(total_price * (discount / 100))

          } else if (Number(total_price) > Number(upto)) {
            discount_price = Number(total_price) - Number(upto)
          }

        }
      }



      await Order.query()
        .where('id', order.id)
        .update({
          original_price: total_price,
          discount_price: discount_price
        })

      const userOrders = await Database.select(
        'orders.order_code',
        'books.id as book_id',
        'books.name',
        'books.price',
        'book_orders.quantity',
        'orders.created_at',
        'orders.status'
      )
        .from('book_orders')
        .leftJoin('books', 'book_orders.book_id', 'books.id')
        .leftJoin('orders', 'book_orders.order_id', 'orders.id')
        .where('book_orders.user_id', user.id)

      const orderList = []
      userOrders.map(item => {
        orderList.push({
          ...item,
          total: item.price * item.quantity
        })

      })

      const user_email = address.email || user.$attributes.email

      var estimated_date = new Date();
      estimated_date.setDate(estimated_date.getDate() + Number(payment.delivery_time));

      /* await Mail.raw(AfterPurchase(_books, total_item, 0, payment.delivery_cost, 0, payment.info.price, address, user_email, estimated_date.toLocaleDateString()),
        message => {
          message.from("support@abookstore.co.ke");
          message.to(user_email);
          message.subject("Order Complete");
        }
      ); */

      return response.status(200).json({
        success: true,
        messages: "Order created successfully",
        data: orderList,
        mail: [_books, total_item, 0, payment.delivery_cost, 0, payment.info.price, address, user_email, estimated_date.toLocaleDateString()]
      })

    } catch (error) {
      console.log(error);
      return response.status(500).json({
        success: false,
        messages: "could not place order"
      })
    }
  }

  async succesPayment({ params, view, response, request }) {
    //console.log('params', request.post())
    const { order_ref, user_mail } = request.post()
    const affectedRows = await Database
      .table('orders')
      .where('order_code', order_ref)
      .update('paid', '0')
    try {
      await Mail.raw(AfterPurchase(...user_mail),
        message => {
          message.from("support@abookstore.co.ke");
          message.to(user_mail[7]);
          message.subject("Order Complete");
        }
      )
    } catch (error) { console.log('error', error) }

    if (affectedRows) {
      return response.status(200).json({
        success: true, affectedRows
      })
    } else {
      return response.status(200).json({
        success: false, affectedRows
      })
    }
  }

  async getPaymentIframe({ params, view, response, request }) {
    const token = await this.getSwypePayToken()
    const get_iframe_url = `${Env.get('SWYPEPAY_BASE_URL')}/web-iframe`
    const global_key = Env.get('SWYPEPAY_GLOBAL_KEY')
    const server_url = Env.get('SWYPEPAY_SERVER_URL')
    const MERCHANT_CODE = Env.get('SWYPEPAY_MERCHANT_CODE')

    const { userMobile, amount } = request.post()
    const orderRef = `#${(voucher.generate({ length: 5, count: 1, charset: voucher.charset("alphanumeric") }).pop()).toUpperCase()}`
    const orderRefBase64 = Buffer.from(orderRef).toString('base64')
    var options = {
      'method': 'POST',
      'url': get_iframe_url,
      'headers': {
        'Global-key': global_key,
        'Server-url': server_url,
        'Access-Token': token
      },
      formData: {
        'phone': userMobile,
        'wallet': '0',
        'amount': amount,
        'currency': 'KES',
        'merchant_code': MERCHANT_CODE,
        'ecommerce': '0',
        'mpesa': '1',
        'tkash': '1',
        'visa': '1',
        'mastercard': '1',
        'american_express': '1',
        'order_ref': orderRef,
        'callback': `https://abookstore.co.ke/swype_success/${orderRefBase64}`
      }
    }

    function doRequest(url) {
      return new Promise(function (resolve, reject) {
        httpRequest(url, function (error, res, body) {
          if (!error && res.statusCode == 200) {
            resolve(body);
          } else {
            reject(error);
          }
        });
      });
    }
    let res = { data: { iframe_url: '' } }
    try {
      let resp = await doRequest(options);
      res = JSON.parse(resp)
    } catch { }

    return response.status(200).json({
      success: true,
      messages: "iframe-success",
      data: { iframe: res.data.iframe_url, orderRef }
    })
  }


  async show({ params, view, response }) {
    const id = params.id

    try {

      const order = await Order.query()
        .with('address')
        .with('delivery')
        .with('promo')
        .with('books')
        .where('id', id)
        .fetch()

      let orderData = order.toJSON()
      orderData = orderData[0]

      orderData.created_at = moment(orderData.created_at).format('MM/DD/YYYY hh:mm A')

      if (orderData.books.length !== 0) {
        const ordered_books = orderData.books
        let total_books = 0
        let total_price = 0
        ordered_books.map(book => {
          total_books += book.quantity
          total_price += book.quantity_price
        })

        orderData.total_books = total_books
        orderData.total_price = total_price
        orderData.promo_price = total_price

        if (orderData.promo_id) {
          const { discount, upto } = orderData.promo

          if (Number(orderData.total_price) <= Number(upto)) {

            orderData.promo_price = Number(orderData.total_price) - Number(orderData.total_price * (discount / 100))

          } else if (Number(orderData.total_price) > Number(upto)) {

            orderData.promo_price = Number(orderData.total_price) - upto
          }
        }

        orderData.final_price = parseFloat(orderData.promo_price) + parseFloat(orderData.delivery.price)
      }

      // orderData.payment.card_number = orderData.payment.card_number.slice(-4)

      const books = []
      orderData.books.map(item => books.push(item.book_id))
      let booksData = await Book.query()
        .select('name', 'cover_images', 'price')
        .whereIn('id', books)
        .fetch()

      booksData = booksData.toJSON()
      booksData.map((item, index) => {
        booksData[index] = {
          ...item,
          ...orderData.books[index]
        }
      })
      return view.render('order.single-order', {
        order_nav: true,
        order: orderData,
        books: booksData,
        payment_method: JSON.parse(orderData.payment)
      })

      /* return response.status(200).send({
        order: orderData,
        books: booksData
      }) */

    } catch (error) {
      console.log(error)
      return response.redirect('back')
    }

  }


  async OrderConfirm({ params, response }) {
    const { id, status } = params
    try {
      const OrderStatus = await Order.query().where('id', id).update({ status: status })
      const user_info = await Database.raw('SELECT first_name,last_name,email FROM users WHERE id= (SELECT user_id from addresses WHERE id = (SELECT address_id from orders WHERE id = ?))', [id])

      const { first_name, last_name, email } = user_info[0][0]
      if (OrderStatus) {
        let title, body
        if (status === 'DELIVERY') {
          title = 'We have news about your order'
          body = `We just came by to let you know that your request is on its way.
          We will be in touch, but you can also get information from your order clicking on Track order.`
        } else if (status === 'DELIVERED') {
          title = 'Your deliver has arrived !'
          body = `Your order has been delivered.`
        }

        if (title && body) {
          await Mail.raw(TrackOrderMailTemplate(`${first_name} ${last_name}`, title, body),
            message => {
              message.from("support@abookstore.co.ke");
              message.to(email);
              message.subject("Email Address Verification");
            }
          );
        }
        return response.redirect('back')
      }
    } catch (error) {
      console.log(error)
      return response.redirect('back')
    }
  }

  async orders({ params, view }) {
    const { status } = params
    try {
      const orders = await Order.query().with('address').with('delivery').with('promo').with('books').where('status', status).fetch()
      const created_order = await Order.query().where('status', 'CREATED').fetch()
      const pending_order = await Order.query().where('status', 'PENDING').fetch()
      const approved_order = await Order.query().where('status', 'APPROVED').fetch()
      const delivery_order = await Order.query().where('status', 'DELIVERY').fetch()
      const delivered_order = await Order.query().where('status', 'DELIVERED').fetch()
      const rejected_order = await Order.query().where('status', 'REJECTED').fetch()

      const all_orders = orders.toJSON()
      all_orders.map(item => {
        item.created_at = moment(item.created_at).format('MM/DD/YYYY hh:mm A')
        if (item.books.length !== 0) {
          const ordered_books = item.books
          let total_books = 0
          let total_price = 0
          ordered_books.map(book => {
            total_books += book.quantity
            total_price += book.quantity_price
          })
          item.total_books = total_books
          item.total_price = total_price
        }
      })

      return view.render('order.index', {
        title: "Approved Order",
        orders_nav: true,
        orders: all_orders,
        created_order: created_order.toJSON().length !== 0 ? created_order.toJSON().length : 0,
        pending_order: pending_order.toJSON().length !== 0 ? pending_order.toJSON().length : 0,
        approved_order: approved_order.toJSON().length !== 0 ? approved_order.toJSON().length : 0,
        delivery_order: delivery_order.toJSON().length !== 0 ? delivery_order.toJSON().length : 0,
        delivered_order: delivered_order.toJSON().length !== 0 ? delivered_order.toJSON().length : 0,
        rejected_order: rejected_order.toJSON().length !== 0 ? rejected_order.toJSON().length : 0,
      })


    } catch (error) {
      console.log(error)
    }
  }


  /*
    mpseaPasswordGen(shortCode, passKey){
  
      const now     = new Date()
      const year    = now.getFullYear()
      const month   = (now.getMonth() < 10)   ? `0${ now.getMonth() }`   : now.getMonth()
      const date    = (now.getDate() < 10)    ? `0${ now.getDate() }`    : now.getDate()
      const hour    = (now.getHours() < 10)   ? `0${ now.getHours() }`   : now.getHours()
      const minutes = (now.getMinutes() < 10) ? `0${ now.getMinutes() }` : now.getMinutes()
      const seconds = (now.getSeconds() < 10) ? `0${ now.getSeconds() }` : now.getSeconds()
  
  
      const timestamp = `${ year }${ month }${ date }${ hour }${ minutes }${ seconds }`
  
      const passwordString = `${ shortCode }${ passKey }${ timestamp }`
  
      const password = new Buffer.from(passwordString).toString('base64')
  
      return {password, timestamp}
  
    }
  
    async mpesaPayment(data){
  
      const MSISD                     = String(data.mpesa_number)
      const amount                    = String(data.price)
      const OrderRef                  = String(data.ref)
  
      const mPesa_consumer_key        = Env.get('MPESA_CONSUMSER_KEY')
      const mPesa_secret_key          = Env.get('MPESA_SECRECT_KEY')
      const mPesa_login_url           = Env.get('MPESA_LOGIN_URL')
      const mPesa_process_url         = Env.get('MPESA_PROCESS_URL')
      const mPesa_online_passkey      = Env.get('MPESA_ONLINE_PASS_KEY')
      const mPesa_business_sort_code  = Env.get('MPESA_BUSINESS_SHORT_CODE')
      const mPesa_party_b             = Env.get('MPESA_PARTY_B')
      const mPesa_callback_url        = Env.get('MPESA_CALLBACK_URL')
      const mPesa_transaction_desc    = Env.get('MPESA_TRANSACTION_DESC')
  
      const rightNow = new Date().getTime()
      const timeDiff = ((MPESA_EXPIRE_TOKEN_TIME - rightNow)/1000)
  
      if(timeDiff < 30){
  
          try {
  
            const res = await axios.get(mPesa_login_url, {
              auth:{
                username: mPesa_consumer_key,
                password: mPesa_secret_key
              }
            })
  
            MPESA_AUTH_TOKEN = res.data.access_token
            MPESA_EXPIRE_TOKEN_TIME = parseInt(new Date().getTime() + res.data.expires_in * 1000)
  
          } catch (error) {
            console.error('OrderController::mpesaPayment - mpesa auth error: ',error)
            return false
          }
        }
  
        const { password, timestamp } = this.mpseaPasswordGen(mPesa_business_sort_code, mPesa_online_passkey)
  
        const paymentRequestBody = {
          BusinessShortCode: mPesa_business_sort_code,
          Password:`${ password }`,
          Timestamp:`${ timestamp }`,
          TransactionType:"CustomerPayBillOnline",
          Amount:amount.trim(),
          PartyA:MSISD.trim(),
          PartyB:mPesa_party_b,
          PhoneNumber:MSISD.trim(),
          CallBackURL:mPesa_callback_url,
          AccountReference:OrderRef,
          TransactionDesc:mPesa_transaction_desc
        }
  
        try {
  
            const result = await axios.post(mPesa_process_url, paymentRequestBody, {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': "*",
                'Authorization': `Bearer ${ MPESA_AUTH_TOKEN }`
              }
            })
  
            if(result.status === 200)
              return true
  
        } catch (error) {
        }
  
        return false
    }
  
    async mpesaSuccess({request, response}) {
  
  
      console.log(request.all())
  
  
    }
  */

  async getSwypePayToken() {

    //const consumer_key_buff = Buffer.from(Env.get('SWYPEPAY_CONSUMER_KEY'), 'base64')
    //const consumer_secret_buff = Buffer.from(Env.get('SWYPEPAY_CONSUMER_SECRET'), 'base64')
    //const hashedString = sha512(`${consumer_key_buff}: ${consumer_secret_buff}`)
    //const buff = Buffer.from(hashedString)
    //const credentials = buff.toString('base64')
    const consumer_key = Env.get('SWYPEPAY_CONSUMER_KEY')
    const consumer_secret = Env.get('SWYPEPAY_CONSUMER_SECRET')

    const MERCHANT_CODE = Env.get('SWYPEPAY_MERCHANT_CODE')
    const CREDENTIAL_URL = `${Env.get('SWYPEPAY_BASE_URL')}/credentials`
    const TOKEN_URL = `${Env.get('SWYPEPAY_BASE_URL')}/token`
    try {
      const result = await formRequest(CREDENTIAL_URL, {
        form: {
          consumer_key: consumer_key,
          consumer_secret: consumer_secret,
          merchant_code: MERCHANT_CODE
        }
      })

      const { status, message, data } = JSON.parse(result.body)
      if (message === 'success') {
        const result2 = await formRequest(TOKEN_URL, {
          form: {
            credentials: data.credentials,
            merchant_code: MERCHANT_CODE
          }
        })
        const rs2 = JSON.parse(result2.body)
        const token = rs2.data.token
        if (message === 'success') {
          return token
        } else {
          return false
        }
      } else {
        return false
      }

    } catch (error) {
      return error
    }

    return false
  }

  async mpesaPayment(data) {

    const phone = String(data.mpesa_number).trim()
    const amount = parseInt(data.price)
    const OrderRef = String(data.ref)

    const MPESA_URL = `${Env.get('SWYPEPAY_BASE_URL')} / mpesa`

    const token = await this.getSwypePayToken()

    if (!token) return false

    try {
      const result = await formRequest({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Server-url': `${Env.get('SWYPEPAY_SERVER_URL')}`,
          'Global-key': `${Env.get('SWYPEPAY_GLOBAL_KEY')}`,
          'Access-token': `${token}`
        },
        url: MPESA_URL,
        form: {
          phone: phone,
          amount: amount
        }
      })

      const { status, message, data } = JSON.parse(result.body)

      if (message === 'success') {
        return true
      } else {
        return false
      }

    } catch (error) {
    }

    return false
  }
}

module.exports = OrderController
