const Env = use('Env')
const Paypal = require('paypal-rest-sdk')

let client = null

let paypal_config = {
    payer: {

    },
    redirect_urls: {
        "return_url": Env.get('PAYPAL_RETURN_URL'),
        "cancel_url": Env.get('PAYPAL_CANCEL_URL')
    },
    transactions:[]
}

class PaymentService {
    constructor(config) {
        this.method = config.method
        this.paypal = config.paypal

        this.__init(this.method)       
    }

    __init(method) {
        switch (method) {
            case 'paypal':
                Paypal.configure({
                    mode: this.paypal.mode,
                    client_id: this.paypal.client_id,
                    client_secret: this.paypal.client_secret
                })

                this.method = 'paypal'
                client = Paypal
                break;
            case 'visa':

                break;
            case 'mpesa':

                break;
            default:
                break;
        }
    }

    method(method_name) {       
        this.__init(method_name)                
        return this
    }

    pay(items, total, currency) {
        switch (this.method) {
            case 'paypal':
                const _transactions = {
                    item_list: {
                        items: items
                    },
                    amount: {
                        currency: currency,
                        total: String(total)
                    },
                    description: "Book purchase payment in abookstore.co.ke"
                }

                paypal_config.transactions.push(_transactions)

                client.payment.create(paypal_config, (error, payment) => {
                    if (error) {
                        throw error
                    } else {
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === 'approval_url') {
                                res.redirect(payment.links[i].href);
                            }
                        }
                    }
                })

                break;
        
            default:
                break;
        }        
    }


}

module.exports = PaymentService