import Administrateur from "../models/administrateur.js";
import { crypt, comparer } from '../util/bcrypt.js';
import { generateToken } from "../util/token.js";

class AdminController{
    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async create(req, res){
        try {
            const {email, password, ...body} = req.body;
            const isAdmin =  await Administrateur.findOne({email, statut: 1});
            if(isAdmin) return res.status(400).json({status:false,message: "Utilisateur existe déjà"});
            req.body.password = await crypt(password);
            const newAdmin = await Administrateur.create(req.body);
            if(!newAdmin) return res.status(501).json({status:false, message: "Inscription echouée"});
            res.cookie("token", generateToken(newAdmin.toObject()))
            res.status(201).json({ status:true, token: generateToken(newAdmin.toObject()), message : "Compte crée Merci  !!!!", newAdmin })
        } catch (error) {
            console.log(error);
            res.status(501).json({message: error.message});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getAll(req, res){
        try {
            const isAdmin = await Administrateur.findOne({_id: req.auth._id, email: req.auth.email, statut: 1});
            if(!isAdmin) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete", status: false});
            const allAdmin = await Administrateur.find({statut: 1}).populate('plateforme');
            if(!allAdmin.length) return res.status(401).json({message:"Aucune donnée n'est trouvée !", status: false});
            res.status(202).json({ status:true, message : "Entrprise bien crée !!", data: allAdmin });
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
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
            const isAdmain = await Administrateur.findOne({email:req.auth.email, _id:req.auth._id, statut: 1});
            if(!isAdmain) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete", status: false});
            const admin = await Administrateur.findById(req.params.id).populate('plateforme');
            if(!admin || !admin.statut) return res.status(401).json({message:"Aucune donnée n'est trouvée !", status: false});
            res.status(201).json({ status:true, data: admin, messag: 'Requête favorable.'});
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect", status: false});
        } 
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getByName(req, res){
        try {
            const isAdmin = await Administrateur.findOne({_id:req.auth._id, statut: 1});
            if(!isAdmin) return res.status(400).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete", status: false});
            const allAdmin = await Administrateur.find({fullname: req.params.fullname, statut: 1}).populate('plateforme');
            res.status(200).json({ status:true, data: allAdmin, message:`Il y'a ${allAdmin.length} élément trouvés`});
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.getByName", error.message);
            res.status(500).json({message: error.messag, status: false});
        } 
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async update(req, res){
        try {
            const isAdmin = await Administrateur.findOne({email:req.auth.email, _id: req.auth._id, statut: 1});
            if(!isAdmin) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
            const hasAdmin = await Administrateur.findOne({_d: req.params.id, statut: 1});
            if(!hasAdmin) return res.status(201).json({message:"Les données au modifier ne sont pas présentes !", status: false});
            delete req.body._id;
            delete req.body.statut;
            const updated = await Administrateur.findByIdAndUpdate(req.params.id, req.body, {new: true});
            res.status(202).json({ status:true, data: updated});
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
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
            const {id} = req.params
            const {_id, email} = req.auth
            const isAdmin = await Administrateur.findOne({_id, email, statut: 1});
            if(!isAdmin) return res.status(400).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete", status: false});
            const hasAdmin = await Administrateur.findOne({_id: id, statut: 1});
            if(!hasAdmin) return res.status(401).json({message:"Les données au modifier ne sont pas présentes !", statut: false});
            const deleted = await Administrateur.updateOne({_id: id}, {statut: 0});
            res.status(202).json({ status:true, data: deleted, message: 'Modification effectuée avec succès !'});
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }
}

export default AdminController;