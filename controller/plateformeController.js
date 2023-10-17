import administrateur from "../models/administrateur.js";
import Plateforme from "../models/plateformeModel.js";
import user from "../models/user.js";


class PlateformeController{
    static async createOrUpdate(req, res){
        try {
            administrateur.findOne({email: req.auth.email})
            .then(admin => {
                if(!admin) return res.status(202).json({message: "Mot de passe ou email incorrect !", statut:false});
                Plateforme.find()
                .then(plateforme => {
                    req.body.modifierPar = admin.id;
                    if(!plateforme.length){
                        req.body.creerPar = admin.id;
                        Plateforme.create(req.body)
                        .then(newPlateforme => {
                            res.status(201).json({newPlateforme, statut:true, message:"Utilisateur ajouté avec succès !"});
                        })
                        .catch(error => {
                            res.status(401).json({error : "Insertion échouée, veuillez réessayer plus tard !", statut:false})
                        })
                    }else{
                        req.body.updatedAt = new Date();
                        Plateforme.updateOne({_id: plateforme[0]._id},req.body)
                        .then(async opdated =>{
                            const newPlateforme = await Plateforme.findById(plateforme[0]._id);
                            res.status(201).json({message: "Mise à jour effectuée avec succès !", plateforme:newPlateforme, statut:true})
                        })
                        .catch(error => {
                            res.status(401).json({error : "Requète interceptée, veuillez réessayer plus tard !", statut:false})
                        } )
                    }
                })
                .catch(error => {
                    console.log("--------------------------error3", error);
                    res.status(401).json({error : "Requète érronée, veuillez réessayer dans quelques instants !"})
                });
            })
            .catch(error => {
                console.log("--------------------------error4", error);
                res.status(401).json({error : "Requète éronée, veuillez réessayer dans quelques instants !"})
            });
        } catch (error) {
            console.log("--------------------------error5", error);
            res.status(401).json({error : "Une erreur est survenue, veuillez réessayer dans quelques instants !"})
        }
    }
}

export default PlateformeController;