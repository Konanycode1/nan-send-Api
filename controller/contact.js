import Contact from '../models/contact.js';
import User from '../models/user.js'

class ControlContact {
    static async create(req,res){
        try{
            const {email, numeroWhatsapp, numeroSms,...body} = req.body;
            const {_id} = req.user;
            const user = await User.fondById(_id);
            if(user){
                res
                .status(401)
                .json({
                    status: false,
                    message: "Vous n'etes pas enregistrer"
                })
                return
            }
            const verifyEmail =  await Contact.findOne([email])
            if(verifyEmail){
                res
                .status(401)
                .json({
                    status: false,
                    message: "contact existe déjà"
                })
                return
            }
            const verifyNumeroSms = await Contact.findOne({numeroSms})
            if(verifyNumeroSms){
                res
                .status(401)
                .json({
                    status: false,
                    message: "numero existe déjà"
                })
                return
            }
            const verifyNumeroWhatsapp = await Contact.findOne({numeroWhatsapp})
            if(verifyNumeroWhatsapp){
                res
                .status(401)
                .json({
                    status: false,
                    message: "numero whatsapp existe déjà"
                })
                return
            }
             await Contact.create({
                email,
                numeroWhatsapp,
                numeroSms,
                user:user._id,
                ...body

            })
            res
            .status(201)
            .json({
                status:true,
                message: 'contact ajouté !!'
            })

        }
        catch(e){
            res
                .status(500)
                .json({
                    status: false,
                    message:e.message
                })
        }
       

    }
    static async update(req,res){
        try {
            const {_id} = req.user;
            const {id} = req.params;
            const {email,...body} = req.body;
            const user = await User.findById(_id);
            if(!user){
                res
                .status(401)
                .json({
                    status: false,
                    message:'compte introuvable !!'
                })
            }
            const contactExist = await Contact.findOne({_id:id})
            if(!contactExist){
                res
                .status(401)
                .json({
                    status: false,
                    message:'contact introuvable !!'
                })
            }
            await contactExist.update({email,...body})
            res
            .status(200)
            .json({
                status: true,
                message:'Contact modifié'
            })
            
        } catch (e) {
            res
            .status(500)
            .json({
                status: false,
                message:e.message
            })
        }
    }
    static async delete(req,res){
        try {
            const {_id} = req.user;
            const {id} = req.params;
            const user = await User.findById(_id);
            if(!user){
                res
                .status(401)
                .json({
                    status: false,
                    message:'compte introuvable !!'
                })
            }
            const contactExist = await Contact.findOne({_id:id})
            if(!contactExist){
                res
                .status(401)
                .json({
                    status: false,
                    message:'contact introuvable !!'
                })
            }
            await contactExist.deleteOne({_id:id})
            res
            .status(200)
            .json({
                status: true,
                message:'Contact supprimé !!!'
            })
            
        } catch (e) {
            res
            .status(500)
            .json({
                status: false,
                message:e.message
            })
        }
    }
    static async getContactId(req,res){
        try {
            const {_id} = req.user;
            const id = req.params; 
            let user = await User.findById(_id)
            if(!user){
                res
                .status(401)
                .json({
                    status:false,
                    messsage: 'Compte introuvable'
                })
            }
            let contactsend = await Contact.findOne({_id:id});
            if(!contactsend){
                res
                .status(401)
                .json({
                    status:false,
                    messsage: 'contact introuvable'
                })
            }
            res
            .status(201)
            .json({
                status: true,
                message:{...contactsend.toObject()}
            })

            
        } catch (e) {
            res
            .status(500)
            .json({
                status: false,
                message:e.message
            })
        }
        

    }
    static async getAll(req,res){
        try {
            const user = await Contact.find()
            res
            .status(201)
            .json({
                status:true,
                message:{ ...user.toObject()}
            })
        } catch (e) {
            
        }
    }
    static async  importContact(req,res){
        try {
            const body = [...req.body];
           const verif=  body.map((ele)=>{
                let newCont ={}
                const contactExist = Contact.findOne({email: ele.email})
                if(contactExist){
                    newCont= {
                            ...ele 
                    }
                    return newCont
                }
                else {
                    return ele
                }
            })
            const importy = await Contact.create(
                ... verif
            )
            if(!importy){
                !res.status(404).json({status:200, message:"erreur d'enregistrement"})
                return
            }
            res
            .status(200)
            .json({
                status: true,
                message:  "enregistrement effectue"
            })
            
            
        } catch (e) {
            res
            .status(500)
            .json({
                status: false,
                message:e.message
            })
        }

    }
}
export default ControlContact 