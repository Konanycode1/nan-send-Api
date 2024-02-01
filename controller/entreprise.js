
import Administrateur from "../models/administrateur.js";
import Agent from "../models/agent.js";
import Entreprise from "../models/entreprise.js";
import User from "../models/user.js";
import Plateforme from "../models/plateforme.js";
import { generateToken } from "../util/token.js";


class EntrepriseController{
    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async create(req, res){
        try {
            const {email, raisonSociale, ...body} = req.body
            const {_id} = req.auth // Midlleware pour l'inscription
            const verifUser = await User.findOne({_id, statut: 1});
            if(!verifUser) return res.status(402).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
            const existEntre = await Entreprise.findOne({raisonSociale:req.body.raisonSociale, statut: 1})
            if(existEntre) return res.status(402).json({message: "Entreprise existe déjà"});
            req.body.user = _id;
            const newEntrprise = await Entreprise.create(req.body);
            const updateUser = await User.updateOne({_id, statut: 1},{entreprise: newEntrprise._id});
            if(!updateUser.acknowledged || !updateUser.modifiedCount) return res.status(402).json({statut: false, message: "Entreprise bien crée, mais utilisateur n'a pas été mise à jour."});
            const nose = await Entreprise.findById(newEntrprise._id);
            
            const data = {
                _id:verifUser._id,
                email: verifUser.email,
                password: verifUser.password,
                entreprise: newEntrprise._id,
                plateforme: undefined
            };
            res.status(202).json({status:true, message:'Entreprise bien crée !', token: generateToken(data), data:newEntrprise})
        } catch (error) {
            res.status(500).json({message: error.message});
        } 
    }
    

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getAll(req, res){
        try {
            const {_id, email, plateforme} = req.auth;
            // if(!plateforme) return res.status(400).json({message: "Vous n'êtes pas authorisé à effectuer cette requête.", status:false});
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
            if(!isAdmin) return res.status(402).json({message: "Mot de passe ou email incorrects !", status: false});
            // const isPlateforme = await Plateforme.findOne({_id:plateforme, statut: 1});
            // if(!isPlateforme) return res.status(402).json({message: "Vous n'êtes pas authorisé à effectuer cette requête."? status: false});
            const entreprise = await Entreprise.find({statut: 1}).populate('user');
            if(!entreprise.length) return res.status(402).json({message: "Aucune donnée trouvée.", status: false});
            res.status(202).json({total: entreprise.length, message: "Requête effectuée avec succès.", status: true, data: entreprise});
        } catch (error) {
            res.status(500).json({message: "Mot de passe ou email incorrect", status: false});
        } 
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getById(req, res){
        try {
            const {_id, entreprise, plateforme} = req.auth;
            const isAdmin = await Administrateur.findOne({_id, email:req.auth.email, plateforme, statut:1 });
            const isUser =  await User.findOne({_id, email:req.auth.email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email:req.auth.email, entreprise, statut: 1});
            let isEntreprise, isPlateforme;
            if(!isAdmin && !isAgent && !isUser) return res.status(402).json({message: "Mot de passe ou email incorrects", status: false});
            if(isAgent || isUser){
                isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            }else isPlateforme = await Plateforme.findOne({_id:plateforme, statut:1});
            
            if(!isEntreprise && !isPlateforme) return res.status(402).json({message: "Vous ne faites pas partie d'aucune structure", status: false});
            res.status(202).json({message: "Requête traitée avec succès.", status: true, data: isEntreprise});
        } catch (error) {
            res.status(501).json({message : "Erreur survenue lors du traitement de la requête !", errorMessage: error.message, status: false});
        }
    }

    static async getOneById(req, res){
        try {
            const { id } = req.params
            console.log("notre id" , id)
            const {_id, entreprise, plateforme} = req.auth;
            const isAdmin = await Administrateur.findOne({_id, email:req.auth.email, plateforme, statut:1 });
            const isUser =  await User.findOne({_id, email:req.auth.email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email:req.auth.email, entreprise, statut: 1});
            let isEntreprise, isPlateforme;
            if(!isAdmin && !isAgent && !isUser) return res.status(402).json({message: "Mot de passe ou email incorrects", status: false});
            if(isAgent || isUser){
                isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            }else isPlateforme = await Plateforme.findOne({_id:plateforme, statut:1});
            if(isAdmin) isEntreprise = await Entreprise.findOne({_id: id , statut : 1})
            console.log("notre entreprise" , isEntreprise)
            if(!isEntreprise && !isPlateforme) return res.status(402).json({message: "Vous ne faites pas partie d'aucune structure", status: false});
            res.status(202).json({message: "Requête traitée avec succès.", status: true, data: isEntreprise});
        } catch (error) {
            res.status(501).json({message : "Erreur survenue lors du traitement de la requête !", errorMessage: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getByName(req, res){
        try {
            const {_id, entreprise, plateforme} = req.auth;
            const isAdmin = await Administrateur.findOne({ _id, email:req.auth.email, plateforme, statut:1 });
            const isUser =  await User.findOne({ _id, email:req.auth.email, entreprise, statut: 1 });
            const isAgent = await Agent.findOne({ _id, email:req.auth.email, entreprise, statut: 1 });
            let isEntreprise, isPlateforme;
            if(!isAdmin && !isAgent && !isUser) return res.status(402).json({message: "Mot de passe ou email incorrects", status: false});
            if(isAgent || isUser) isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            else isPlateforme = await Plateforme.findOne({_id:plateforme, statut:1});

            if(!isEntreprise && !isPlateforme) return res.status(402).json({message: "Vous ne faites pas partie d'aucune structure", status: false});
            let data = isEntreprise ? await Entreprise.find({_id:entreprise, statut: 1}).populate('user') : await Entreprise.find({statut: 1}).populate('user');
            data = data.filter(element=>element.raisonSociale.toLowerCase().includes(req.params.raisonSociale.toLowerCase()));
            if(!data.length) return res.status(402).json({message: "Données introuvables", status: false});
            res.status(202).json({message: "Requête traitée avec succès.", status: true, total:data.length, data});
        } catch (error) {
            res.status(501).json({message : "Erreur survenue lors du traitement de la requête !", errorMessage: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async update(req, res){
        try {
            const {id} = req.params;
            const {_id, email, entreprise} = req.auth;
            if(entreprise != id) return res.status(402).json({message: "L'entreprise cherchée ne correspond pas à là-votre"});
            const isUser = await User.findOne({_id, email, statut: 1});
            if(!isUser) return res.status(402).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete, mot de passe ou email incorrect", status: false});
            const isProprietaire = await User.findOne({_id, email, entreprise, statut: 1});
            if(!isProprietaire) return res.status(402).json({message: "L'entreprise à modifier ne vous correspond pas. Mise à jour annuléé !", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!isEntreprise) return res.status(402).json({message: "L'entreprise à mettre à jour n'existe pas", status: false});
            req.body.updatedAt = Date.now();
            delete req.body.statut;
            delete req.body._id;
            const updated = await Entreprise.updateOne({_id:id, user:isUser._id, statut: 1}, req.body);
            if(!updated.acknowledged || !updated.modifiedCount) return res.status(402).json({statut: false, message: "Mise à jour non effectuée."});
            res.status(202).json({ message: "Mise à jour effectuée avec succès !", status: true});
        } catch (error) {
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async delete(req, res){
        try {
            const {id} = req.params;
            const {_id} = req.auth;
            console.log(id , _id)
            // if(entreprise != id) return res.status(400).json({message: "L'entreprise cherchée ne correspond pas à là-votre"});
            const isUser = await Administrateur.findOne({_id, statut: 1});
            if(!isUser) return res.status(402).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete, mot de passe ou email incorrect", status: false});
            // const isProprietaire = await User.findOne({_id, email, entreprise, statut: 1});
            // if(!isProprietaire) return res.status(402).json({message: "L'entreprise à modifier ne vous correspond pas. Mise à jour annuléé !", status: false});
            console.log("l'id a modifier" , id)
            const isEntreprise = await Entreprise.findOne({_id : id , statut :1});
            console.log("notre entreprise" ,isEntreprise)
            if(!isEntreprise) return res.status(402).json({message: "L'entreprise à mettre à jour n'existe pas", status: false});
            const updated = await Entreprise.findByIdAndUpdate({_id :id, statut: 1}, {statut: 0, updatedAt: Date.now()});
            // if(!updated.acknowledged || !updated.modifiedCount) return res.status(402).json({statut: false, message: "Mise à jour non effectuée."});
            if(!updated)return res.status(402).json({statut: false, message: "Mise à jour non effectuée."});
            res.status(202).json({ status:true, message: "Mise à jour effectuée avec succès !", status: true});
        } catch (error) {
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }
}

export default EntrepriseController;