import express  from "express";
import verify_token from "../midlleware/withAuth.js";
import EmailController from "../controller/emailController.js";

const RouterSendCodeValidation = express.Router();
RouterSendCodeValidation.post("/sendCodeValidate", EmailController.sendCodeValidation);


export default RouterSendCodeValidation;