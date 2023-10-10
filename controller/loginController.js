import {sign_token} from "../midlleware/auth.js"

import bcrypt from "bcrypt";
import User from "../models/user.js";
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
                    res.status(201).json({email: utilisateur.email, portefeuil: utilisateur.entreprise._id, token: `token ${sign_token({id:utilisateur._id,email:utilisateur.email, entreprise:utilisateur.entreprise._id})}`})
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
}

export default LoginController;
