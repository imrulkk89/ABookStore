'use strict'
const Permission = use('App/Models/Permission');
const Logger = use('Logger')


class PermissionController {
    
    index=async({response,view})=>{
        try{
         const permission = await Permission.all();
            return view.render('permission.create',{

            })
        }
        catch(error){

        }
    }

    create=({response,view})=>{

    }

    store=async({request,response})=>{

    }

    show=async({params,view})=>{

    }

    edit=async({params,response})=>{

    }

    update=async({params,request})=>{

    }

    destroy=async({params,response})=>{

    }
}

module.exports = PermissionController
