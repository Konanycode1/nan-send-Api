import express  from "express";
import cookieParser from "cookie-parser";
import EntrepriseController from "../controller/entrepriseController.js";
import UtilisateurController from "../controller/utilisateurController.js";
import PlateformeController from "../controller/plateformeController.js";
import EmailController from "../controller/emailController.js";
import verify_token from "../midlleware/auth.js"


const Router = express.Router();
Router.use(cookieParser());

Router.get("/", (req, res)=>{
    console.log(58)
    res.status(200)
})

/***************************************** */
/** LES ROUTES CONCERNANT LA PLATEFORME MERE* */
/***************************************** */
/**Route permettant d'ajouter ou de modifier les information de la plateforme mère */
Router.post("/createOrUpdatePlateforme", PlateformeController.createOrUpdate);

/***************************************** */
/** LES ROUTES CONCERNANT L'ENOIE D'EMAIL DE CODE DE VALIDATION */
/***************************************** */
Router.post("/sendCodeValidation", EmailController.sendCodeValidation);


/***************************************** */
/** LES ROUTES CONCERNANT LES ENTREPRISES* */
/***************************************** */
// Route permettant de créer ou ajouter les Entreprises
Router.post("/createEntreprise", EntrepriseController.create);
// Route permettant de modifier les Entreprises
Router.post("/updateEntreprise", EntrepriseController.update);
// Route permettant de spprimer les Entreprise. La suppression consiste à faire passer le statut de l'entreprise de 1 à 0
Router.post("/deleteEntreprise", EntrepriseController.delete);
// Route permettant de récupérer tout les Entreprises
Router.get("/getAllEntreprise", EntrepriseController.getAll);
// Route permettant de récupérer une entreprise connaissant son identifiant
Router.get("/getByIdEntreprise/:id", EntrepriseController.getById);
// Route permettant de recupérer les entreprise par leur nom (raison sociale)
Router.get("/getByNameEntreprise/:raisonSociale", EntrepriseController.getByName);


Router.post("/createUsers", UtilisateurController.create)



export default Router;