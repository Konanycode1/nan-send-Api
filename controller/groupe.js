import mongoose from "mongoose";
import Administrateur from "../models/administrateur.js";
import Agent from "../models/agent.js";
import Contact from "../models/contact.js";
import Entreprise from "../models/entreprise.js";
import User from "../models/user.js";
import Groupe from "../models/groupe.js";
import Plateforme from "../models/plateforme.js";





class GroupeController{
    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async create(req, res){
        try {
            const fetchNewsInformations = [];
            const filterContact = [];
            const formatContact = [];
            const isGroupe = await Groupe.findOne({name: req.body.name});
            if(isGroupe) return res.status(401).json({message: 'Ce groupe est déjà crée', status: false})
            const { _id, email, entreprise } = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            const newsInformations = req.body.contact;
            const ourCanal = req.body.canal;
            newsInformations.map(item => fetchNewsInformations.push(item.split('-')[0]));

            const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
            if(!isUserOrIsAgent) return res.status(401).json({message: "Mot de passe ou email incorrects !", status: false});
            if(isUser) req.body.user = isUser._id;
            if(isAgent) req.body.agent = isAgent._id;
            const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
            if(!isEntreprise) return res.status(402).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
            const isPresent = await Groupe.findOne({name: req.body.name.toLowerCase(), statut: 1});
            if(isPresent) return res.status(400).json({message: "Ce contact est déjà ajouté", status: false});
            req.body.entreprise = isEntreprise._id;

            const ourContacts = await Contact.find({entreprise: req.body.entreprise});
            if(!ourContacts) return res.status(401).json({message: 'Impossible de créer une équipe, contacta(s) introuvable.', status: false});
            if(ourCanal === 'email'){
                ourContacts.map(item => { if(fetchNewsInformations.includes(item.email)) filterContact.push(item)});
            }else if(ourCanal === 'whatsapp'){
                ourContacts.map(item =>  {if(fetchNewsInformations.includes(item.whatsapp)) filterContact.push(item)});
            }else if(ourCanal === 'sms'){
                ourContacts.map(item => { if(fetchNewsInformations.includes(item.sms)) filterContact.push(item)});
            }else{
                return res.status(400).json({message: "Canal de difusion non valide", status: false});
            }

            if(!filterContact.length) return res.status(401).json({message: 'Impossible de créer une équipe, contacta(s) introuvable.', status: false});
            filterContact.map(item => formatContact.push(new mongoose.Types.ObjectId(item._id)));
            req.body.contact = formatContact;
            const newGroupe = await Groupe.create(req.body);
            res.status(202).json({data: newGroupe, message: "Enregistrer effectué avec succès.", status:true});
        } catch (error) {
            console.log(error.message, error);
            res.status(500).json({ status: false, message: error.message });
        }
        
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getAll(req, res){
        try {
            const { _id, email, entreprise, plateforme } = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
            let isStructure, isMember, resultat = [];
            if(!isUser && !isAgent && !isAdmin) return res.status(403).json({message: "Mot de passe ou email incorrects.", status: false});
            isMember = isUser || isAgent;
            console.log(isMember);
            if(isMember){
                isStructure = await Entreprise.findOne({_id:isMember.entreprise, statut: 1});
                if(isStructure) resultat = await Groupe.find({entreprise: isStructure._id, statut: 1});
            }else{
                isStructure = await Plateforme.findOne({_id:isAdmin.plateforme._id});
                if(isStructure) resultat = await Groupe.find({ statut: 1 });
            }
            if(!isStructure) return res.status(403).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
            if(!resultat.length) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
            return res.status(202).json({message: "Requête traitée avec succès.", total: resultat.length, status: true, data:resultat});
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }
    
    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getById(req, res){
        try {
            
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getByName(req, res){
        try {
            
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getByEntreprise(req, res){
        try {
            
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async update(req, res){
        try {
            
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async delete(req, res){
        try {
            
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }
}

export default GroupeController;