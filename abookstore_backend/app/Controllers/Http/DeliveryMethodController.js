'use strict'
const DeliveryMethod = use('App/Models/DeliveryMethod');
class DeliveryMethodController {
    async index({ request, response, view }) {
        try {
            const deliveryMethod = await DeliveryMethod.all();
            return view.render('settings/index', {
                title: "Delivery method",
                settings: true,
                delivery: true,
                deliveryMethods: deliveryMethod.toJSON()
            })
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                success: false,
                message: "server error occurred",
            })
        }
    }


    async create({ params, view, response, request }) {
        const { estate, delivery_time, delivery_fee } = request.post()
        try {
            await DeliveryMethod.create({ delivery_name: estate, delivery_time, price: delivery_fee });
            const deliveryMethod = await DeliveryMethod.all();
            /* return view.render('settings/index', {
                title: "Delivery method",
                settings: true,
                delivery: true,
                deliveryMethods: deliveryMethod.toJSON()
            }) */
            return response.redirect('/admin/delivery')
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                success: false,
                message: "server error occurred",
            })
        }
        console.log(params, request.post())
    }

    async edit({ params, view, response }) {

        try {
            const deliveryMethod = await DeliveryMethod.find(params.id);
            return view.render('settings/edit', {
                deliveryMethod: deliveryMethod.toJSON()
            })
        } catch (error) {

        }
    }

    async update({ request, response }) {
        try {
            const deliveryMethod = await DeliveryMethod.query()
                .where('id', request.body.id)
                .update(request.only([
                    'delivery_name',
                    'delivery_time',
                    'price'
                ]))

            return response.redirect('/admin/delivery')
        } catch (error) {
            console.log(error)
            return response.redirect('back')
        }
    }

    async delete({ params, request, response }) {
        const { id } = params
        try {
            await DeliveryMethod.query()
                .where('id', id)
                .delete()

            return response.redirect('/admin/delivery')
        } catch (error) {
            console.log(error)
            return response.redirect('back')
        }
    }



    async getAllDeliveryMethod({ response }) {
        try {
            const deliveryMethod = await DeliveryMethod.all();
            return response.status(200).json({
                success: true,
                message: "Delivery method populated successfully",
                data: deliveryMethod.rows
            })
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                success: false,
                message: "server error occurred",
            })
        }
    }


}

module.exports = DeliveryMethodController
