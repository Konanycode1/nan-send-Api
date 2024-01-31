import User from '../models/user.js';
import { generateToken } from '../util/token.js';
import { crypt, comparer } from '../util/bcrypt.js';
import Agent from '../models/agent.js';
import Administrateur from '../models/administrateur.js';
import Entreprise from '../models/entreprise.js';
import Plateforme from '../models/plateforme.js';

class AgentController {
    static async create(req, res){
        try {
            const {_id, entreprise} = req.auth;
            const {email, password} = req.body;
            const user =  await User.findOne({_id, entreprise, statut: 1});
            if(!user) return res.status(400).json({status:false,message: "Mot de passe ou email incorrect !"});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            if(!isEntreprise) return res.status(203).json({message: "Vous ne faites pas partie d'aucune entreprise", status: false});
            const isAgent = await Agent.findOne({email, statut: 1});
            if(isAgent) return res.status(400).json({message: "Ce agent est déjà ajouté !", status: false});
            req.body.password = await crypt(password);
            req.body.entreprise = isEntreprise._id;
            req.body.user = user._id;
            const newAgent = await Agent.create(req.body);
            if(!newAgent) return res.status(501).json({status:false, message: "Inscription échouée"});
            res.cookie("token", generateToken(newAgent.toObject()));
            res.status(201).json({ status:true, message : "Compte crée Merci  !!!!", data: newAgent });
        } catch (e) {
            res.status(501).json({message: e.message});
        }
    }


    // OBTENIR TOUT LES UTILISATEUR
    static async getAll( req , res ){
        try {
            const {_id, email, entreprise, plateforme} = req.auth;
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
            const isUser =  await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            let isEntreprise, isPlateforme;
            if(!isAdmin && !isAgent && !isUser) return res.status(203).json({message: "Mot de passe ou email incorrects", status: false});
            if(isAgent || isUser){
                isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            }else{
                isPlateforme = await Plateforme.findOne({_id:plateforme, statut:1});
            }
            if(!isEntreprise && !isPlateforme) return res.status(203).json({message: "Vous ne faites pas partie d'aucune structure", status: false});
            const agent = isEntreprise ? await Agent.find({entreprise:isEntreprise._id, statut: 1}).populate('entreprise').populate('user') : await Agent.find({statut: 1}).populate('entreprise').populate('user');
            if(!agent.length) return res.status(201).json({message: "Données introuvables", status: false});
            res.status(201).json({message: "Requête traitée avec succès.", status: true, total: agent.length, data: agent});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    
    static async getById(req , res ){
        try {
            const {_id, email, entreprise, plateforme} = req.auth;
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut:1 });
            const isUser =  await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            let isEntreprise, isPlateforme;
            if(!isAdmin && !isAgent && !isUser) return res.status(203).json({message: "Mot de passe ou email incorrects", status: false});
            if(isAgent || isUser){
                isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            }else{
                isPlateforme = await Plateforme.findOne({_id:plateforme, statut:1});
            }
            if(!isEntreprise && !isPlateforme) return res.status(203).json({message: "Vous ne faites pas partie d'aucune structure", status: false});
            const agent = isEntreprise ? await Agent.findOne({_id: req.params.id, entreprise:isEntreprise._id, statut: 1}).populate('entreprise').populate('user') : await Agent.findOne({_id: req.params.id, statut: 1}).populate('entreprise').populate('user');
            if(!agent) return res.status(201).json({message: "Données introuvables", status: false});
            res.status(201).json({message: "Requête traitée avec succès.", status: true, data: agent});
        } catch (error) {
            res.status(501).json({message : "Erreur survenue lors du traitement de la requête !", errorMessage: error.message, status: false});
        }
    }

    
    static async getByName(req , res ){
        try {
            const {_id, email, entreprise, plateforme} = req.auth;
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut:1 });
            const isUser =  await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            let isEntreprise, isPlateforme;
            if(!isAdmin && !isAgent && !isUser) return res.status(203).json({message: "Mot de passe ou email incorrects", status: false});
            if(isAgent || isUser){
                isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            }else{
                isPlateforme = await Plateforme.findOne({_id:plateforme, statut:1});
            }
            if(!isEntreprise && !isPlateforme) return res.status(203).json({message: "Vous ne faites pas partie d'aucune structure", status: false});
            let agent = isEntreprise ? await Agent.find({entreprise:isEntreprise._id, statut: 1}).populate('entreprise').populate('user') : await Agent.find({statut: 1}).populate('entreprise').populate('user');
            agent = agent.filter(element=>element.fullname.toLowerCase().includes(req.params.name.toLowerCase()));
            if(!agent.length) return res.status(201).json({message: "Données introuvables", status: false});
            res.status(201).json({message: "Requête traitée avec succès.", status: true, total:agent.length, data: agent});
        } catch (error) {
            res.status(501).json({message : "Erreur survenue lors du traitement de la requête !", errorMessage: error.message, status: false});
        }
    }

    // SUPPRIMER UTILISATEUR AVEC SON ID
    static async delete(req , res){
        try {
            const {_id, email, entreprise} = req.auth;
            const { id } = req.params;
            const isUser = await User.findOne({_id, email, entreprise, statut:1});
            if( !isUser) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            if(!isEntreprise) return res.status(203).json({message: "Vous ne faite pas partie d'uncune entreprise.", status: false});
            const isAgent = Agent.findOne({_id: id, entreprise:isEntreprise._id, statut: 1});
            if(!isAgent) return res.status(203).json({message: "L'agent à supprimer n'existe pas !", status: false});
            const updated = await Agent.updateOne({_id: req.params.id, entreprise:isEntreprise._id, statut: 1}, {statut: 0, updatedAt: Date.now()});
            if(!updated.acknowledged || !updated.modifiedCount) return res.status(401).json({statut: false, message: "Suppression non effectué."});
            res.status(201).json({message: "Suppression effectué avec succès", status: true});
        } catch (error) {
            res.status(400).json({message : error});
        }
    }

    // METTRE A JOUR LES INFORMATION DE L'UTILISATEUR
    static async update( req , res ){
        try {
            const {_id, email, entreprise} = req.auth;
            const { id } = req.params;
            const isUser = await User.findOne({_id, email, entreprise, statut:1});
            if( !isUser) return res.status(401).json({message: "Mot de passe ou email incorrects !", status: false});
            const isEntreprise = await Entreprise.findOne({_id:entreprise, statut:1});
            if(!isEntreprise) return res.status(401).json({message: "Vous ne faite pas partie d'uncune entreprise.", status: false});
            const isAgent = Agent.findOne({_id: id, entreprise:isEntreprise._id, statut: 1});
            if(!isAgent) return res.status(401).json({message: "L'agent à supprimer n'existe pas !", status: false});
            req.body.updatedAt = Date.now();
            delete req.body.statut;
            delete req.body._id;
            const updated = await Agent.updateOne({_id: req.params.id, entreprise:isEntreprise._id, statut: 1}, req.body);
            if(!updated.acknowledged || !updated.modifiedCount) return res.status(401).json({statut: false, message: "Mise à jour non effectué."});
            res.status(201).json({message: "Mise à jour effectué avec succès", status: true});
        } catch (error) {
            res.status(400).json({message : error});
        }
    }
}

export default AgentController;
