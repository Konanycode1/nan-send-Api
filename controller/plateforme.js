import Administrateur from "../models/administrateur.js";
import Plateforme from "../models/plateforme.js";
import { generateToken } from "../util/token.js";


class PlateformeController{
    static async createOrUpdate(req, res){
        try {
            const isAdmin = await Administrateur.findOne({_id: req.auth._id, email: req.auth.email, statut: 1});
            if(!isAdmin) return res.status(203).json({message: "Mot de passe ou email incorrect !", status: false});
            const isPlateforme = await Plateforme.find();
            if(!isPlateforme.length){
                req.body.creerPar = isAdmin._id;
                req.body.modifierPar = isAdmin._id;
                const newPlateforme = await Plateforme.create(req.body);
                
                if(newPlateforme){
                    const updateAdmin = await Administrateur.updateOne({_id: req.auth._id, email: req.auth.email, statut: 1}, {plateforme: newPlateforme._id});
                    if(!updateAdmin.acknowledged || !updateAdmin.modifiedCount) return res.status(201).json({statut: true,message: "Plateforme créé avec succès, mais administrateur non mise à jour."});
                    const data = {
                        _id:req.auth._id,
                        email: req.auth.email,
                        password: req.auth.password,
                        entreprise: undefined,
                        plateforme: newPlateforme._id
                    };
                    res.status(203).json({statut: true, message: "Plateforme créé avec succès.", plateforme: newPlateforme, token: generateToken(data)});
                }
            }else{
                const isMember = await Administrateur.findOne({_id: req.auth._id, email: req.auth.email, plateforme: req.auth.plateforme, statut: 1});
                if(!isMember) return res.status(203).json({message: "Vous n'êtes pas membre de la plateforme !", status: false});
                req.body.modifierPar = isMember._id;
                req.body.updatedAt = Date.now();
                delete req.body.statut;
                delete req.body._id;
                const newPlateforme = await Plateforme.updateOne({_id: req.auth.plateforme}, req.body);
                if(!newPlateforme.acknowledged || !newPlateforme.modifiedCount) return res.status(400).json({statut: false,message: "Mise à jour non effectuée."});
                res.status(203).json({statut: true, message: "Mise à jour effectuée avec succès."});
            }
        }catch(error) {
            console.log(error)
            res.status(401).json({error : "Une erreur est survenue, veuillez réessayer dans quelques instants !", status: false})
        }
    }
}

export default PlateformeController;