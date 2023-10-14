import Agent from '../models/agent.js'
import Entreprise  from '../models/entreprise.js';
import User from '../models/user.js'
import { verifEmail } from '../util/verifEmail.js';
class Message{

    static async createEmail(req,res){
        try{
            let verifUser = {}
            const {_id, entreprise, role} = req.auth;
            const {canal, piecesJointes, contenu, contact} = req.body;
            const verifCompagny = await Entreprise.findById(entreprise)
            if(!verifCompagny){
                res.status(404).json({status:false,message:'Entreprise introuvable'})
                return
            }
            verifUser = role !=="Proprio"? await Agent.findById(_id): await User.findById(_id);
            if(!verifUser){
                res.status(404).json({status:false, message:'Compte introuvable'})
                return
            }
            if(canal != "email"){
                res.status(404).json({status:false, message:'Impossible de poursuivre cette requette.'})
                return
            }
            contact.forEach((eleCon) => {
                if(isNaN(parseInt(eleCon)) ||  verifEmail(eleCon)){
                    res.status(404).json({status:false, message:'Impossible de poursuivre cette requette NaN-Send.'})
                    return
                }

            } )



        }
        catch(e){
            res.status(500).json({status:false , message: e.message})
        }
    }
}