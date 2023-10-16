import generateRandomString from "../laboratoire/generateRandomString.js";
import transporteur from "../mailling/transporteur.js";
import code_auth from "../mailling/code_auth.js";
import User from "../models/user.js";
import Plateforme from "../models/plateformeModel.js";

class EmailController{
    static async sendCodeValidation(req, res){
        try {
            // On récupère le destinataire dans la base de données
            const user = await User.findOne({email: req.body.email});
            // Si le destinataire existe on interrompe l'envoie du mail en envoyant un message au client pour informer que le compte est utilisé
            if(user) return res.status(200).json({message: "Ce compte est déjè utilisé.", statut:false});
            // Si le destinataire n'existe pas dans la base de données on tente de récpérer l'expéditeur dans la base de données
            const plateforme = await Plateforme.find();
            // Si l'expéditeur n'existe pas on interrompe la suite du traitement en envoyant un message au client
            if(!plateforme.length) return req.status(202).json({message: "Service momentanement indisponible !", statut:false});
            // Si l'expéditeur existe en génère de manière aléatoire un code de 6 chiffre dont le premier chiffre est difference de 0
            const code = generateRandomString("0123456789", 6);
            // On met en forme l'information à transmettre
            const donneEmail={ email:req.body.email, fullname:req.body.fullname, plateforme:plateforme[0].raisonSociale, code:code };
            // On établie la connexion au serveur de méssagerie ootlmail
            const connection = transporteur({ user: `${plateforme[0].emailInfo}`, pass: `${plateforme[0].passwordEmailInfo}`});
            // On transmet l'information de l'expéditeur vers le receveur
            const email = await connection.sendMail({
                from: `"${plateforme[0].raisonSociale}" <${plateforme[0].emailInfo}>`,
                bcc: [donneEmail.email],
                subject:"VALIDATION DE SECURITE",
                html: code_auth(donneEmail)
            });
            // Si l'expéditeur n'a pas accès à la connexion internet on envoie un message au client
            if(!email.response.includes("OK")) return res.status(400).json({message: "Connexion interrompue.", statut:false, error});
            // Sinon on retourne le code de validation au client.
            return res.status(201).json({message: "Code de validation unique.",code, statut:true})
        } catch (error) {
            // Si un problème survient au niveau du serveur, on retourne un message
            res.status(501).json({message:"Traitement de la demande a été interrompu.", statut:false, error});
        }
    }

    static async sendEmailForOneAdress(req, res){
        const user = await User.findById(req.auth._id);
        if(!user) return res.status(203).json({message: "Vous n'êtes pas authorisé(e) à effectuer cette requète, veuillez-vous authentifier !", status: false});
        const plateforme = await Plateforme.find();
        if(!plateforme.length) return req.status(202).json({message: "Service momentanement indisponible !", statut:false});
        

    }
}

export default  EmailController;