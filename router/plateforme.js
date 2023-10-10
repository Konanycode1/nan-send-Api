import express  from "express";
import PlateformeController from "../controller/plateformeController.js";

const RouterPlateforme = express.Router();

/***************************************** */
/** LES ROUTES CONCERNANT LA PLATEFORME MERE* */
/***************************************** */
/**Route permettant d'ajouter ou de modifier les information de la plateforme mère */
RouterPlateforme.post("/createOrUpdatePlateforme", PlateformeController.createOrUpdate);

export default RouterPlateforme;