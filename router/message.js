import express  from "express";

import AUTH from "../midlleware/withAuth.js";
import Attachement from "../midlleware/attachement.js";
import MessageController from "../controller/message.js";
const RouterMessage = express.Router();

/***************************************** */
/** LES ROUTES CONCERNANT L'ENOIE D'EMAIL DE CODE DE VALIDATION */
/***************************************** */
RouterMessage.post("/verifyEmail", MessageController.verifyEmail);
RouterMessage.post('/email', AUTH, Attachement.array("piecesJointes"), MessageController.createEmail);
RouterMessage.post('/whatsapp', AUTH, MessageController.sendWhatsAppMessage);
RouterMessage.post('/create', AUTH, Attachement.array("piecesJointes"), MessageController.create);
RouterMessage.get('/getAll', AUTH,  MessageController.getAll);

RouterMessage.get('/delete/:id', AUTH,  MessageController.delete);
RouterMessage.get('/getById/:id', AUTH,  MessageController.getById);
RouterMessage.get('/getByName/:object', AUTH,  MessageController.getByName);
RouterMessage.put('/update/:id', AUTH, Attachement.array("piecesJointes"),  MessageController.update);
RouterMessage.delete('/delete/:id', AUTH,  MessageController.delete);
RouterMessage.put('/updateSendingMessage/:id', AUTH, MessageController.updateSendingMessage);

export default RouterMessage;