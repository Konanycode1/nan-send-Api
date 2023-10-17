

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
            const admin =  await Administrateur.findOne({email:req.body.email});
            if(admin) return res.status(400).json({status:false, message: "Utilisateur existe déjà"});
            req.body.password = await crypt(req.body.password);
            const newAdmin = await Administrateur.create(req.body);
            if(!newAdmin) return res.status(501).json({status:false, message: "inscription echouée"});
            res.status(201).json({newAdmin, message : "Compte crée Merci  !!!!" })
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
            Administrateur.findOne({_id: req.auth._id, email: req.auth.email})
            .then(admin=>{
                if(!admin) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete", status: false});
                Administrateur.findAll()
                .then(allAdmin=>{
                    if(!allAdmin.length) return res.status(201).json({message:"Aucune donnée n'est trouvée !", status: false});
                    // req.cookie("token", generateToken(newUser.toObject()))
                    res.status(202).json({ status:true, message : "Entrprise bien crée !!" })
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !", status: false}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !", status: false}));
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
            Administrateur.findOne({email:req.auth.email, _id:req.auth._id})
            .then(admin=>{
                if(!admin) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Entrepise.findById(req.params.id)
                .then(oneAdmin=>{
                    if(!oneAdmin) return res.status(201).json({message:"Aucune donnée n'est trouvée !"});
                    res.status(200).json({ status:true, oneAdmin});
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
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
    static async getByName(req, res){
        try {
            Administrateur.findOne({_id:req.auth._id})
            .then(admin=>{
                if(!admin) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Administrateur.findAll({fullname: req.params.fullname})
                .then(someAdmin=>{
                    if(!someAdmin.length) return res.status(201).json({message:"Aucune donnée n'est trouvée !"});
                    res.status(200).json({ status:true, someAdmin, message:`Il y'a ${someAdmin.length} élément trouvés`});
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
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
    static async update(req, res){
        try {
            Administrateur.findOne({email:req.auth.email, _id: req.auth._id})
            .then(admin=>{
                if(!admin) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Entrepise.findById(id)
                .then(oneAdmin=>{
                    if(!oneAdmin) return res.status(201).json({message:"Les données au modifier ne sont pas présentes !"});
                    Entrepise.findByIdAndUpdate(req.body.cibling, req.body, {new: true})
                    .then(newoneAdmin => res.status(202).json({ status:true, newoneAdmin}))
                    .catch(()=>res.status(400).json({message:"Requète avortée !"}));
                })
                .catch(()=>res.status(400).json({message:"Requète avortée !"}));
            })
            .catch(()=>res.status(400).json({message:"Requète avortée !"}));
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
            Administrateur.findOne({email:email})
            .then(admin=>{ 
                if(!admin) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Administrateur.findById(req.params.id)
                .then(oneAdmin=>{
                    if(!oneAdmin) return res.status(201).json({message:"Les données au modifier ne sont pas présentes !"});
                    Administrateur.findByIdAndUpdate(req.body.cibling, {statut: 0}, {new: false})
                    .then(newEntreprise=>{
                        res.status(202).json({ status:true, newEntreprise});
                    })
                    .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }
}

export default AdminController;