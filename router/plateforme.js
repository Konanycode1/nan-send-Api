import express  from "express";
import PlateformeController from "../controller/plateformeController.js";
import verify_token from "../midlleware/withAuth.js";

const RouterPlateforme = express.Router();

/***************************************** */
/** LES ROUTES CONCERNANT LA PLATEFORME MERE* */
/***************************************** */
/**Route permettant d'ajouter ou de modifier les information de la plateforme mère */
RouterPlateforme.post("/createOrUpdate", verify_token, PlateformeController.createOrUpdate);


export default RouterPlateforme;