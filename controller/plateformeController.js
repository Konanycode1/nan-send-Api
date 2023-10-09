import Plateforme from "../models/plateformeModel.js";
import Utilisateur from "../models/utilisateurModel.js";

class PlateformeController{
    static async createOrUpdate(req, res){
        try {
            Utilisateur.findOne({email: req.auth.email, entite: "gestionnaire"})
            .then(utilisateur => {
                if(!utilisateur) return res.status(202).json({message: "Mot de passe ou email incorrect !"});
                Plateforme.findAll()
                .then(plateforme => {
                    req.body.modifierPar = utilisateur.id;
                    if(!plateforme.length){
                        req.body.creerPar = utilisateur.id;
                        Plateforme.create(req.body)
                        .then(newPlateforme => {
                            res.status(201).json(newPlateforme);
                        })
                        .catch(error => {
                            console.log("--------------------------error0", error);
                            res.status(401).json({error : "Insertion échouée, veuillez réessayer plus tard !"})
                        })
                    }else{
                        Plateforme.updateOne(req.body, {_id: plateforme[0]._id})
                        .then(newPlateforme => {
                            Plateforme.findById(plateforme[0]._id)
                            .then(newPlat => {
                                res.status(201).json({message: "Mise à jour effectuée avec succès !", plateforme:newPlat})
                            })
                            .catch(error => {
                                console.log("--------------------------error1", error);
                                res.status(401).json({error : "Mise à jour échouée, veuillez réessayer plus tard !"});
                            } )
                        })
                        .catch(error => {
                            console.log("--------------------------error2", error);
                            res.status(401).json({error : "Requète interceptée, veuillez réessayer plus tard !"})
                        } )
                    }
                })
                .catch(error => {
                    console.log("--------------------------error3", error);
                    res.status(401).json({error : "Requète érronée, veuillez réessayer dans quelques instants !"})
                } )
            })
            .catch(error => {
                console.log("--------------------------error4", error);
                res.status(401).json({error : "Requète éronée, veuillez réessayer dans quelques instants !"})
            } )
        } catch (error) {
            console.log("--------------------------error5", error);
            res.status(401).json({error : "Une erreur est survenue, veuillez réessayer dans quelques instants !"})
        }
    }
}

export default PlateformeController;