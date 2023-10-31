import generateRandomString from '../laboratoire/generateRandomString.js';
import Agent from '../models/agent.js';
import Entreprise from '../models/entreprise.js';
import Article from '../models/stock/article.js';
import User from '../models/user.js';

const chaine = "azertyuiopqsdfghjklmwxcvbn0123456789";

class ArticleController {
    static async create(req, res){
        const {_id, entreprise} = req.auth;
        try {
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false})
            const reference = "STOCKE"+generateRandomString(chaine, 14);
            const article = await Article.create({ libelle:req.body.libelle, reference, montant: req.body.montant, entreprise:isEntreprise._id });
            if(!stocke) return res.status(201).json({message: "Enrégistrement échoué !", status: false});
            res.status(200).json({message: "Stocke ajouté !!", stocke, status: true});
        } catch (error){
            res.status(500).json({message: error.massege, status: false});
        }
    }

    static async getAll(req, res){
        try{
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", status: false});
            const isEntreprise = await Entreprise.findOne({_id:req.auth.entreprise});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const article = await Article.find({statut: 1, entreprise});
            res.status(200).json({article, status: true});
        }catch(error){
            console.log(error)
            res.status(500).json({data: error.message, status: false});
        }
    }

    static async getById(req, res){ // On trouve en fonction de la cle primière du stocke
        try{
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, email, statut: 1});
            const agent = await Agent.findOne({_id, email, statut: 1});
            if(!user && !agent) return res.status(201).json({message: "Vous accès d'authentifications sont incorrectes.", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const article = await Article.findOne({_id:req.params.id, statut:1, entreprise});
            if(!article) return res.status(400).json({message: "Aucun stocke trouvé.", status: false});
            res.status(200).json({article, status: true});
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
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            if(!isEntreprise) return res.status(201).json({message: "Vos accès de l'entreprise introuvable !", status: false});
            const article = await Article.findOne({reference: req.params.reference, statut: 1, entreprise});
            if(!stocke) return res.status(400).json({message: "Aucun stocke trouvé.", status: false})
            res.status(200).json({stocke, status: true});
        }catch(error){
            const message = `URL non valable.`;
            res.status(500).json({message: "URL non valable", error, status: false});
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
            req.body.updatedAt = Date.now();
            delete req.body.statut;
            delete req.body._id;
            const newEntrprise = await Article.updateOne({_id: req.params.id, statut: 1, entreprise},req.body);
            if(!newEntrprise.acknowledged || !newEntrprise.modifiedCount) return res.status(203).json({message: "Modification non effectué.", status: false});
            res.status(201).json({message: "Modification effectué avec succès", newEntrprise, status: true});
        } catch (error) {
            res.status(400).json({error, status: false})
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
            const newEntrprise = await Article.updateOne({_id: req.params.id, statut: 1, entreprise},{statut: 0, updatedAt: Date.now()});
            if(!newEntrprise.acknowledged || !newEntrprise.modifiedCount) return res.status(203).json({statut: false, message: "Suppression non effectué."});
            res.status(201).json({message: "Suppression effectué avec succès", status: true});
        } catch (error) {
            console.log("Controller Stocke try{}catch(){}", error.message, error)
            res.status(501).json({message: "Controller Stocke try{}catch(){}"+error.message,error, statut: false})
        }
    }
}
export default ArticleController;