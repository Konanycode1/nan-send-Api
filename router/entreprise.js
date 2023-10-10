import express from "express";
import EntrepriseController from "../controller/entreprise.js";

import verify_token from "../midlleware/auth.js"

const RouterEntreprise = express.Router();

/***************************************** */
/** LES ROUTES CONCERNANT LES ENTREPRISES* */
/***************************************** */
// Route permettant de créer ou ajouter les Entreprises
RouterEntreprise.post("/createEntreprise", EntrepriseController.create);
// Route permettant de modifier les Entreprises
RouterEntreprise.post("/updateEntreprise", EntrepriseController.update);
// Route permettant de spprimer les Entreprise. La suppression consiste à faire passer le statut de l'entreprise de 1 à 0
RouterEntreprise.post("/deleteEntreprise", EntrepriseController.delete);
// Route permettant de récupérer tout les Entreprises
RouterEntreprise.get("/", EntrepriseController.getAll);
// Route permettant de récupérer une entreprise connaissant son identifiant
RouterEntreprise.get("/getByIdEntreprise/:id", EntrepriseController.getById);
// Route permettant de recupérer les entreprise par leur nom (raison sociale)
RouterEntreprise.get("/getByNameEntreprise/:raisonSociale", EntrepriseController.getByName);






export default RouterEntreprise;