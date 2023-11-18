import express  from "express";

import AUTH from "../midlleware/withAuth.js";
import Attachement from "../midlleware/attachement.js";
import MessageController from "../controller/message.js";
// import uploaded from "../midlleware/upload.js";




const RouterMessage = express.Router();

// console.log("787",attachement)
/***************************************** */
/** LES ROUTES CONCERNANT L'ENOIE D'EMAIL DE CODE DE VALIDATION */
/***************************************** */
RouterMessage.post("/verifyEmail", MessageController.verifyEmail);
RouterMessage.post('/email', AUTH, Attachement, MessageController.createEmail);
RouterMessage.post('/whatsapp', AUTH, MessageController.sendWhatsAppMessage);
RouterMessage.post('/create', AUTH, MessageController.create)

export default RouterMessage;