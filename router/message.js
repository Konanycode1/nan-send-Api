import express  from "express";
import EmailController from "../controller/emailController.js";

const RouterMessage = express.Router();



/***************************************** */
/** LES ROUTES CONCERNANT L'ENOIE D'EMAIL DE CODE DE VALIDATION */
/***************************************** */
RouterMessage.post("/sendCodeValidation", EmailController.sendCodeValidation);

export default RouterMessage;