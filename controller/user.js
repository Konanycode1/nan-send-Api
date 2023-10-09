import Entreprise from "../models/entreprise.js";
import user from "../models/user.js";
import Utilisateur from "../models/user.js";
import { generateToken } from "../util/token.js";


class UtilisateurController{
    static async create(req, res){
        try {
            const {email, ...body} = req.body
            Utilisateur.findOne({email: email})
            .then(user=>{
                if(user) return res.status(201).json({status:false,message: "Ce utilisatateur est déjà ajouté"});
                Utilisateur.create({
                    email,
                    ...body
                })
                .then(newUser=>{
                    res.status(202).json({
                        status:true,
                        token: generateToken(newUser.toObject()),
                        message : "Compte crée Merci  !!!!"
                    })
                    req.cookie("token", generateToken(newUser.toObject()))
                })
                .catch(error=>res.status(400).json({status:false,message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}));
            })
            .catch(error=>res.status(400).json({status:false,message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}))
        } catch (error) {
            res.status(501).json({message: "Service momentanement interrompu, veuillez réessayer dans quelques instants !"})
        }
    }
    static async createAgent(req, res){
        try {
            
            const {email,role, ...body} = req.body
            // const {email, role} = req.auth 
            Utilisateur.findOne({email: email})
            .then(user=>{
                if(user) return res.status(201).json({status:false,message: "Ce utilisatateur est déjà ajouté"});
                Utilisateur.create({
                    email,
                    role: role,
                    ...body
                })
                .then(newUser=>{
                    res.status(202).json({
                        status:true,
                        message : "Compte crée !!!!"
                    })
                })
                .catch(error=>res.status(400).json({status:false,message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}));
            })
            .catch(error=>res.status(400).json({status:false,message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}))
        } catch (error) {
            res.status(501).json({message: "Service momentanement interrompu, veuillez réessayer dans quelques instants !"})
        }
    }
}

export default UtilisateurController;