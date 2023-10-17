// import {sign_token} from "../midlleware/auth.js"

import bcrypt from "bcrypt";
import User from "../models/user.js";
import Administrateur from "../models/administrateur.js";
import { generateToken } from "../util/token.js";
import { comparer } from "../util/bcrypt.js";



// import Entreprise from "../models/entrepriseModel";



class LoginController{
    static async login(req, res){
        try {
            User.findOne({email: req.body.email})
            .populate("entreprise")
            .then(utilisateur => {
                if(!utilisateur || !utilisateur.entreprise) return res.status(201).json({message: "Mot de passe ou email incorrect"});
                bcrypt.compare(req.body.password, utilisateur.password)
                .then(hash => {
                    if(!hash) return res.status(200).json({message: "Mot de passe ou email incorrect"});
                    res.status(201).json({email: utilisateur.email, portefeuil: utilisateur.entreprise._id, token: `token ${generateToken({id:utilisateur._id,email:utilisateur.email, entreprise:utilisateur.entreprise._id})}`})
                })
                .catch(error=>{
                    console.log("------------------------------LoginController 2 Connexion interrompue. error", error);
                    res.status(400).json({error: "Connexion interrompue."});
                })
            })
            .catch(error=>{
                console.log("------------------------------LoginController 3 Connexion interrompue. error", error);
                res.status(400).json({error: "Connexion interrompue."});
            })
        } catch (error) {
            console.log("------------------------------LoginController 4 Connexion interrompue. error", error);
            res.status(501).json({error})
        }
    }

    static async loginAdmin(req, res){
        try {
            Administrateur.findOne({email: req.body.email})
            .then(async admin => {
                if(!admin) return res.status(201).json({message: "Mot de passe ou email incorrect"});
                const correctly = await comparer(req.body.password, admin.password);
                if(!correctly) return res.status(200).json({message: "Mot de passe ou email incorrect"});
                res.cookie("token", generateToken(admin.toObject()));
                res.status(201).json({email: admin.email, token: `token ${generateToken({id:admin._id,email:admin.email})}`})
            })
            .catch(error=>{
                console.log("------------------------------LoginController 3 Connexion interrompue. error", error);
                res.status(400).json({error: "Connexion interrompue."});
            })
        } catch (error) {
            console.log("------------------------------LoginController 4 Connexion interrompue. error", error);
            res.status(501).json({error})
        }
    }
}


export default LoginController;
