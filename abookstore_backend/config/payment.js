'use strict'
const Env = use('Env')
module.exports = {
    paypal:{
        mode: Env.get('MODE'), //sandbox or live
        client_id: Env.get('CLIENT_ID'),
        client_secret: Env.get('CLIENT_SECRET')
    }

}


