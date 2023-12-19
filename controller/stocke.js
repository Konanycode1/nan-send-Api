import generateRandomString from '../laboratoire/generateRandomString.js';
import Agent from '../models/agent.js';
import Entreprise from '../models/entreprise.js';
import Stocke from '../models/stock/stocke.js';
import User from '../models/user.js';
const chaine = "azertyuiopqsdfghjklmwxcvbn0123456789";

class StockeController {
    static async create(req, res){
        try {
            const {_id, entreprise, email} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", statut: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", statut: false})
            const reference = "STOCKE"+generateRandomString(chaine, 14);
            const stocke = await Stocke.create({ libelle:req.body.libelle, reference, montant: req.body.montant, entreprise:isEntreprise._id });
            if(!stocke) return res.status(201).json({message: "Enrégistrement échoué !", statut: false});
            res.status(200).json({message: "Stocke ajouté !!", data: stocke, statut: true});
        } catch (error){
            console.log(error);
            res.status(500).json({message: error.massege, statut: false});
        }
    }

    static async getAll(req, res){
        try{
            const {_id, entreprise, email} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", statut: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", statut: false});
            const stocke = await Stocke.find({statut: 1, entreprise});
            res.status(200).json({data: stocke, statut: true});
        }catch(error){
            console.log(error)
            res.status(500).json({data: error.message, statut: false});
        }
    }

    static async getById(req, res){ // On trouve en fonction de la cle primière du stocke
        try{
            const {_id, entreprise, email} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", statut: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", statut: false});
            const stocke = await Stocke.findOne({_id:req.params.id, statut:1, entreprise});
            if(!stocke) return res.status(400).json({message: "Aucun stocke trouvé.", statut: false});
            res.status(200).json({data: stocke, statut: true});
        }catch(error){
            res.status(500).json({message: "URL non valable.", data: error.message, statut: false});
        }
    }

    static async getByReference(req, res){  // On trouve en fonction de la référence du stocke
        try{
            const {_id, entreprise, email} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", statut: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", statut: false});
            const stocke = await Stocke.findOne({reference: req.params.reference, statut: 1, entreprise});
            if(!stocke) return res.status(400).json({message: "Aucun stocke trouvé.", statut: false})
            res.status(200).json({data: stocke, statut: true});
        }catch(error){
            const message = `URL non valable.`;
            res.status(500).json({message: message, data: error.message});
        }
    }

    static async update(req,res){
        try {
            const {_id, entreprise, email} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", statut: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(203).json({message: "Vos accès de l'entreprise introuvable !", statut: false});
            req.body.updatedAt = Date.now();
            delete req.body.statut;
            delete req.body._id;
            const newEntrprise = await Stocke.updateOne({_id: req.params.id, statut: 1, entreprise},req.body);
            if(!newEntrprise.acknowledged || !newEntrprise.modifiedCount) return res.status(203).json({message: "Modification non effectué.", status: false});
            res.status(201).json({message: "Modification effectué avec succès", statut: true});
        } catch (error) {
            console.log(error);
            res.status(400).json({error})
        }
    }

    static async delete(req,res){
        try {
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", statut: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", statut: false});
            // req.body.updatedAt = Date.now();
            const newEntrprise = await Stocke.updateOne({_id: req.params.id, statut: 1, entreprise}, {statut: 0, updatedAt: Date.now()});
            if(!newEntrprise.acknowledged || !newEntrprise.modifiedCount) return res.status(203).json({statut: false, message: "Suppression non effectué."});
            res.status(201).json({message: "Suppression effectué avec succès", statut: true});
        } catch (error) {
            res.status(501).json({message: "Controller Stocke try{}catch(){}"+error.message,error, statut: false})
        }
    }
}
export default StockeController;