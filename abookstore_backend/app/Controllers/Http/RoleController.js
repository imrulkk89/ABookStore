'use strict'
const Role = use('Role')
const Logger=use('Logger')

class RoleController {
    index=async({response,session,view})=>{
        try {
            const roles= await Role.all();
            session.flash({
                notification_success:"Role loaded Success fully"
            })
            return view.render('role.index',{roles:roles.toJSON()})
        } catch (error) {
            Logger.error(error);
            session.flash({
                notification_failure: "Serve Error"
            })
            return response.redirect('back')
        }
    }

    create = async({view,response})=>{
        try {
            return view.render('role.create');
        } catch (error) {
            Logger.error(error)
            return response.redirect('back')
        }
    }

    store = async({request,response,session})=>{
        const {slug,name,description}=request.all();
        try {
            const role = await Role.create({slug,name,description})
            if(role){
                session.flash({
                    notification_success:"Role added successfully"
                })
            }
        } catch (error) {
            Logger.error(error)
            session.flash({
                notification_failure:'Server Error'
            })
        }
    }

    show = async({}) => {}

    edit = async({}) =>{}

    update = async({}) =>{}
    
    destroy = async({}) =>{} 
}

module.exports = RoleController
