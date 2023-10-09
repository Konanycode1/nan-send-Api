import Entreprise from "../models/entrepriseModel.js";
import Utilisateur from "../models/utilisateurModel.js";
import bcrypt from "bcrypt";

class UtilisateurController{
    static async create(req, res){
        try {
            const password = req.body.password;
            Utilisateur.findAll()
            .then(utilisateur => {
                if(!utilisateur.length){
                    req.body.entite = "gestionnaire";
                }else if(utilisateur.find(user => user.email === req.body.email)){
                    return res.status(201).json({message: "Ce compte est déjà utilisé !"});
                }else {
                    req.body.entite = "administrateur";
                }
                bcrypt.hash(password, 10)
                .then(hash => {
                    req.body.password = hash;
                    Utilisateur.create(req.body)
                    .then(newUtlisateur => {
                        if(newUtlisateur.entite === "administrateur"){
                            Entreprise.updateOne({creerPar: newUtlisateur._id, modifierPar: newUtlisateur._id}, {id:req.body.ref_entreprise})
                            .then(updating => {
                                res.status(201).json({newUtlisateur});
                            })
                        }else{
                            res.status(201).json({newUtlisateur});
                        }
                    })
                    .catch(error => {
                        res.status(400).json({message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"});
                    })
                })
                .catch(error => {
                    res.status(400).json({message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"});
                })
            })
            .catch(error => {
                res.status(501).json({message: "Service momentanement interrompu, veuillez réessayer dans quelques instants !"})
            })
        } catch (error) {
            res.status(501).json({message: "Service momentanement interrompu, veuillez réessayer dans quelques instants !"})
        }
    }
}

export default UtilisateurController;