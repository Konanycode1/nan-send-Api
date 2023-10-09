import generateRandomString from "../laboratoire/generateRandomString.js";
import transporteur from "../mailling/transporteur.js";
import nodemailer from "nodemailer";
import code_auth from "../mailling/code_auth.js";
import Utilisateur from "../models/utilisateurModel.js";
import Plateforme from "../models/plateformeModel.js";


// const transporteur = require("../mailling/transporteur.js");
// const generateRandomString = require("../laboratoire/generateRandomString.js");
// const nodemailer = require("nodemailer");
// const code_auth = require("../mailling/code_auth");

// const { default: Utilisateur } = require("../models/utilisateurModel.js");
// const { default: Plateforme } = require("../models/plateformeModel.js");





// const { Connecteur, Transmetteur } = require("../laboratoire/transmettre_email");


// const transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com",
//     port: 587,
//     secure: false,
//     tls:{
//         ciphers: "SSLv3"
//     },
//     auth: {
//       user: 'sage.haley@ethereal.email',
//       pass: 'RjVJtcx44fxzvx46qE'
//     }
//   });

class EmailController{
    static async sendCodeValidation(req, res){
        try {
            Utilisateur.findOne({email: req.body.email})
            .then(user=>{
                console.log("------------------------------1 user", user);
                if(user) return res.status(200).json({error: "Ce compte est déjè utilisé."});

                console.log("------------------------------2 user", user);
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