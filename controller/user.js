import User from '../models/user.js';
import { generateToken } from '../util/token.js';
import { crypt, comparer } from '../util/bcrypt.js';
import Agent from '../models/agent.js';
import Administrateur from '../models/administrateur.js';
import Entreprise from '../models/entreprise.js';

class UserController {

    // FUNCTION POUR CREER UN UTILISATEUR 
    static async create(req, res){
        try {
            const {email, password, ...body} = req.body;
            const user =  await User.findOne({email, statut: 1});
            if(user) return res.status(400).json({status:false,message: "Utilisateur existe déjà"});
            req.body.password = await crypt(password);
            const newUser = await User.create(req.body);
            if(!newUser) return res.status(501).json({status:false, message: "inscription echouée"});
            res.cookie("token", generateToken(newUser.toObject()))
            res.status(201).json({ status:true, token: generateToken(newUser.toObject()), message : "Compte crée Merci  !!!!", newUser })
        } catch (e) {
            res.status(501).json({message: e.message});
        }
    }

    // FUNCTION POUR CREER UN AGENT 
    static async createAgent(req, res){
        try {
            console.log(req.auth)
            const {email, role, password, ...body} = req.body
            const {_id, entreprise} = req.auth;
            const user = await User.findOne({_id, entreprise, statut: 1});
            if(!user) return res.status(404).json({status: false, message: "user introuvable"});
            const verifAgent = await agent.findOne({email: email, statut: 1});
            if(verifAgent) return res.status(401).json({status:false,message: "Ce utilisatateur est déjà ajouté"});
            const agent = await Agent.create({ email, parain: user._id, entreprise, password: await crypt(password), role: role, ...body});
            res.status(202).json({ status:true, message : "Agent crée !!!!" });
        } catch (error) {
            res.status(501).json({message: "Service momentanement interrompu, veuillez réessayer dans quelques instants !"})
        }
    }

// CONNEXION DE L'UTILISATEUR
    static async login(req, res) {
        try {
            const {email, password} = req.body;
            const admin = await Administrateur.findOne({email, statut:1});
            const user = await User.findOne({email,statut:1});
            const agent = await Agent.findOne({email,statut:1});
            if(!user && !agent && !admin) return res.status(203).json({ message: 'utilisateur introuvable', status: false});
            const isConforme = await comparer(password, user.password);
            if(!isConforme) return res.status(400).json({ message: 'adresse mail / mot de passe incorrect' });
            res.cookie("token", generateToken(user ? user.toObject() : agent.toObject()))
            res.status(200).json({ userId: user ? user._id : agent._id, token: generateToken(user ? user.toObject() : agent.toObject()) })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

// OBTENIR TOUT LES UTILISATEUR
    static async getAll( req , res ){
        try {
            const {_id, email, plateforme} = req.auth;
            const admin = await Administrateur.findOne({_id, email, plateforme, statut:1})
            if(!admin) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
            const listUser = await User.find({statut: 1});
            if(!listUser.length) return res.status(203).json({message: "Aucun utilisateur trouvé !", statut: false});
            res.status(202).json({total: listUser.length, listUser, status: true})
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

//  OBTENIR UN UTILISATEUR UNIQUE   
    static async getById(req , res ){
        try {
            const {_id, email, entreprise, plateforme} = req.auth;
            const admin = await Administrateur.findOne({_id, email, plateforme, statut:1});
            const isUser = await User.findOne({_id, email, entreprise, statut:1});
            const agent = await Agent.findOne({ email, entreprise, statut:1});
            if(!admin && !isUser && !agent) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
            const user = await User.findOne({_id: req.params.id, statut: 1});
            if(!user) return res.status(203).json({message: "Aucun utilisateur trouvé !", status: false});
            res.status(200).json({message: "Un utilisateur trouvé !", status: true, user});
        } catch (error) {
            res.status(501).json({message : error});
        }
    }

    // SUPPRIMER UTILISATEUR AVEC SON ID
    static async delete(req , res){
        try {
            const {_id, email, entreprise, plateforme} = req.auth;
            const { id } = req.params;
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut:1});
            // const agent = await Agent.findOne({ email, entreprise, statut:1});
            if( !isAdmin ) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
            const user =await User.findOne({_id: id, statut: 1});
            if(!user) return res.status(203).json({message: "L'utilisateur à modifier n'existe pas !", status: false});
            const updated = await User.updateOne({_id: req.params.id, entreprise, statut: 1}, {statut: 0});
            if(!updated.acknowledged || !updated.modifiedCount) return res.status(203).json({statut: false, message: "Suppression non effectué."});
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
            const isUser = await User.findOne({_id, email, entreprise, statut:1 });
            const agent = await Agent.findOne({ email, entreprise, statut:1 });
            if( !isUser && !agent ) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
            const user = await User.findOne({_id: id, statut: 1});
            if(!user) return res.status(203).json({message: "L'utilisateur à modifier n'existe pas !", status: false});
            delete req.body.statut;
            delete req.body.delete_id;
            const updated = await User.updateOne({_id: req.params.id, entreprise, statut: 1}, req.body);
            if(!updated.acknowledged || !updated.modifiedCount) return res.status(203).json({statut: false, message: "Mise à jour non effectué."});
            res.status(201).json({message: "Mise à jour effectué avec succès", status: true});            
        } catch (error) {
            res.status(400).json({message : error});
        }
    }
}

export default UserController;
