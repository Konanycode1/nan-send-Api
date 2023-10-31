import express  from "express";

import Message from "../controller/message.js"
import AUTH from "../midlleware/withAuth.js";
import Attachement from "../midlleware/attachement.js";
import uploaded from "../midlleware/upload.js";


const RouterMessage = express.Router();

// console.log("787",attachement)
/***************************************** */
/** LES ROUTES CONCERNANT L'ENOIE D'EMAIL DE CODE DE VALIDATION */
/***************************************** */
RouterMessage.post("/verifyEmail", Message.verifyEmail);
// RouterMessage.post('/email', AUTH, ()=>attachement, Message.createEmail)
RouterMessage.post('/email', AUTH, Attachement, Message.createEmail)

export default RouterMessage;