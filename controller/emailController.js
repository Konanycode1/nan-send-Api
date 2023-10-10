import generateRandomString from "../laboratoire/generateRandomString.js";
import transporteur from "../mailling/transporteur.js";
import nodemailer from "nodemailer";
import code_auth from "../mailling/code_auth.js";
import User from "../models/user.js";
import Plateforme from "../models/plateformeModel.js";

class EmailController{
    static async sendCodeValidation(req, res){
        try {
            User.findOne({email: req.body.email})
            .then(use=>{
                console.log("------------------------------1 user", use);
                if(use) return res.status(200).json({error: "Ce compte est déjè utilisé."});

                console.log("------------------------------2 user", use);
                const code = generateRandomString("0123456789", 6);
                Plateforme.findById(req.body.plateforme)
                .then(plateforme=>{
                    if(!plateforme) req.status(202).json({message: "Service momentanement indisponible !"});
                    const donneEmail={
                        email:req.body.email,
                        nom:req.body.nom,
                        prenom:req.body.prenom,
                        plateforme:plateforme.raisonSociale,
                        code:code
                    };
                    const connection = transporteur(nodemailer, "smtp-mail.outlook.com", 587, false, {ciphers:"SSLv3"}, { user: `${plateforme.emailInfo}`, pass: `${plateforme.passwordEmailInfo}`});
                    connection.sendMail({
                        from: `"${plateforme.raisonSociale}" <${plateforme.emailInfo}>`,
                        to: donneEmail.email,
                        subject:"VALIDATION DE SECURITE",
                        html: code_auth(donneEmail)
                    })
                    .then(email=>{
                        console.log("------------------------------email", email);
                        console.log("*******************************", {code});
                        res.status(201).json({code});
                    })
                    .catch(error=>{
                        console.log("------------------------------Connexion interrompue. email error", error);
                        res.status(400).json({error: "Connexion interrompue."});
                    })
                })
                .catch(error=>{
                    console.log("------------------------------Service momentanement indisponible !", error);
                    res.status(400).json({error: "Service momentanement indisponible !"});
                })
            })
            .catch(error=>{
                console.log("------------------------------Connexion échouée 1. email error", error);
                res.status(400).json({error: "Connexion échouée."});
            })
        } catch (error) {
            console.log("------------------------------Connexion échouée 2. email error", error);
            res.status(501).json({error:"Connexion échouée."});
        }
    }
}


export default  EmailController;