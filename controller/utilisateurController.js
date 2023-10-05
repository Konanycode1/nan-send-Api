import Entreprise from "../models/entrepriseModel.js";
import Utilisateur from "../models/utilisateur_model.js";

class UtilisateurController{
    static async create(req, res){
        try {
            Utilisateur.findOne({email: req.body.email})
            .then(user=>{
                if(user) return res.status(201).json({message: "Ce utilisatateur est déjà ajouté"});
                Utilisateur.create(req.body)
                .then(newUser=>{
                    res.status(202).json(newUser)
                })
                .catch(error=>res.status(400).json({message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}));
            })
            .catch(error=>res.status(400).json({message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}))
        } catch (error) {
            res.status(501).json({message: "Service momentanement interrompu, veuillez réessayer dans quelques instants !"})
        }
    }
}

export default UtilisateurController;