import generateRandomString from '../laboratoire/generateRandomString.js';
import Agent from '../models/agent.js';
import Entreprise from '../models/entreprise.js';
import Categorie from '../models/stock/categorie.js';
import Stocke from '../models/stock/stocke.js';
import User from '../models/user.js';
const chaine = "azertyuiopqsdfghjklmwxcvbn0123456789";

class CategorieController {
    static async create(req, res){
        const {_id, entreprise} = req.auth;
        try {
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const stocke = await Stocke.findOne({_id:req.body.stocke, entreprise, statut: 1});
            if(!stocke) return res.status(201).json({message: "Cette stocke n'est liée à aucun stocke !", status: false});
            const reference = "CATEGO"+generateRandomString(chaine, 14);
            const categorie = await Categorie.create({ ...req.body, reference, entreprise:isEntreprise._id });
            if(!categorie) return res.status(201).json({message: "Enrégistrement échoué !", status: false});
            res.status(200).json({message: "Catégorie ajouté !!", data: categorie, status: true});
        } catch (error){
            res.status(500).json({message: error.massege});
        }
    }

    static async getAll(req, res){
        try{
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, entreprise, statut: 1});
            const agent = await Agent.findOne({_id, entreprise, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const categorie = await Categorie.find({statut: 1, entreprise}).populate('entreprise').populate('stocke');
            res.status(200).json({data: categorie, status: true});
        }catch(error){
            res.status(500).json({data: error.message, status: false});
        }
    }

    static async getById(req, res){ // On trouve en fonction de la cle primière du stocke
        try{
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes."});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const categorie = await Categorie.findOne({_id:req.params.id, statut: 1, entreprise}).populate('entreprise').populate('stocke');
            if(!categorie) return res.status(203).json({message: "Aucun stocke trouvé.", status: false});
            res.status(202).json({data: categorie, status: true});
        }catch(error){
            res.status(500).json({message: "URL non valable", data: error.message, status: false});
        }
    }

    static async getByReference(req, res){  // On trouve en fonction de la référence du stocke
        try{
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const categorie = await Categorie.findOne({reference: req.params.reference, statut: 1, entreprise}).populate('entreprise').populate('stocke');
            if(!categorie) return res.status(400).json({message: "Aucune catégorie trouvée.", status: false})
            res.status(200).json({data: categorie, status: true});
        }catch(error){
            res.status(500).json({message: "URL non valable.",data: error.message, status: false});
        }
    }

    static async update(req,res){
        try {
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const updated = await Categorie.findOne({_d:req.params.id, entreprise});
            if(!updated) return res.status(203).json({message: "La catégorie à modifier n'existe pas !", status: false});
            req.body.updatedAt = Date.now();
            delete req.body.statut;
            delete req.body._id;
            const newCategorie = await Stocke.updateOne({_id:req.params.id, entreprise}, req.body);
            if(!newCategorie.acknowledged || !newCategorie.modifiedCount) return res.status(203).json({statut: false,message: "Modification non effectué."});
            res.status(201).json({message: "Modification effectué avec succès", status: true});
        } catch (error) {
            res.status(400).json({error, status: false})
        }
    }

    static async delete(req,res){
        try {
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const deleted = await Categorie.findOne({_id:req.params.id, entreprise});
            if(!deleted) return res.status(203).json({message: "La catégorie à modifier n'existe pas !", status: false});
            const newDeleted = await Categorie.updateOne({id: req.params.id, entreprise}, {statut: 0, updatedAt: Date.now});
            if(!newDeleted.acknowledged || !newDeleted.modifiedCount) return res.status(203).json({statut: false, message: "Suppression non effectué."});
            res.status(201).json({message: "Suppression effectué avec succès", status: true});
        } catch (error) {
            res.status(400).json({error, status: false})
        }
    }
}
export default CategorieController;