import express  from "express";
import EmailController from "../controller/emailController.js";
import Message from "../controller/message.js"

const RouterMessage = express.Router();



/***************************************** */
/** LES ROUTES CONCERNANT L'ENOIE D'EMAIL DE CODE DE VALIDATION */
/***************************************** */
RouterMessage.post("/sendCodeValidation", EmailController.sendCodeValidation);
RouterMessage.post('/email', Message.createEmail)

export default RouterMessage;