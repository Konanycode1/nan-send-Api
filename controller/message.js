import Agent from '../models/agent.js'
import Entreprise  from '../models/entreprise.js';
import User from '../models/user.js'
// import { verifEmail } from '../util/verifEmail.js';
// import { sendEmail } from '../util/sendMail.js';
import htmlFormatEmail from "../mailling/htmlFormatEmail.js";
import transporteur from "../mailling/transporteur.js";
import verify_email_adress from '../laboratoire/verify_email_adress.js';
// import Message from '../models/message.js';
import Plateforme from '../models/plateforme.js';
import ValidateCode from '../models/validateCode.js';
import code_auth from "../mailling/code_auth.js";
import generateRandomString from '../laboratoire/generateRandomString.js';





class MessageController{
    static async verifyEmail(req, res){
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
            req.body.code = generateRandomString("0123456789", 6);
            console.log("...............................", req.body);
            const isTry = await ValidateCode.findOne({email: req.body.email});
            if(isTry) return res.status(203).json({message: "Veuillez confirmer l'email de validation"})
            const valide = await ValidateCode.create(req.body);
            
            const url = `http://127.0.0.1:5500/controller/valide.html?${valide.code}#${valide.id}`;
            // On met en forme l'information à transmettre
            const donneEmail={ fullname:valide.fullname, plateforme:plateforme[0].raisonSociale, url, code:valide.code };
            // On établie la connexion au serveur de méssagerie ootlmail
            const connection = transporteur({ user: `${plateforme[0].emailInfo}`, pass: `${plateforme[0].passwordEmailInfo}`});
            // On transmet l'information de l'expéditeur vers le receveur
            const email = await connection.sendMail({
                from: `"${plateforme[0].raisonSociale}" <${plateforme[0].emailInfo}>`,
                bcc: [req.body.email],
                subject:"VALIDATION DE SECURITE",
                html: code_auth(donneEmail)
            });
            // Si l'expéditeur n'a pas accès à la connexion internet on envoie un message au client
            if(!email.response.includes("OK")) return res.status(400).json({message: "Connexion interrompue.", statut:false, error});
            const validate = await ValidateCode.create(req.body);
            // Sinon on retourne le code de validation au client.
            return res.status(201).json({message: "Code de validation unique.",code: valide.code, new: validate, statut:true})
        } catch (error) {
            console.log(error)
            // Si un problème survient au niveau du serveur, on retourne un message
            res.status(501).json({message:"Traitement de la demande a été interrompu.", statut:false, error});
        }
    }

    static async createEmail(req,res){
        try{
            const {_id, email, entreprise, role} = req.auth;
            
            let {canal, contenu, contact} = req.body;
            // On vérifie si la constante contact est un tableau qui contient au moins un adresse email
            if(!(Array.isArray(contact) && contact.some(emailAdress =>verify_email_adress(emailAdress)) || (typeof(contact)=="string" && verify_email_adress(contact)))) return res.status(400).json({message: "Les contacts chargés ne contiennent aucun adresse mail.", status: false});
            // On tente de récupérer les informations de l'entréprise dans la base de données
            if(Array.isArray(contact) && contact.some(emailAdress =>verify_email_adress(emailAdress))) contact = contact.filter(item=>verify_email_adress(item));
            
            // const allContact = Array.isArray(contact) && contact.some(emailAdress =>verify_email_adress(emailAdress)) ?contact.filter(item=>verify_email_adress(item)):
            const verifCompagny = await Entreprise.findOne({_id:entreprise, statut: 1});
            // Si la l'entréprise n'existe pas dans la base de données, on renvoie un message au client
            if(!verifCompagny) return res.status(404).json({status:false,message:'Entreprise introuvable'});
            /**Si l'entreprise existe, on vérifie si celui qui effectue la requette est le chef d'entreprise, sinon il devra être un employé de l'entreprise
             * et on tente de recupèrer  les information de ce employé dans la base données
            */
            
            const isMember =  await Agent.findOne({_id, entreprise, statut: 1}) || await User.findOne({_id, entreprise, statut: 1});
            // Si ce employé n'est belle pas dans la base de données, on renvoie un message au client
            if(!isMember) return res.status(404).json({status:false, message:'Compte introuvable'});
            
            // Sinon, on vérifie si le canal de difision n'est pas celui du canal email on renvoie un message au client
            if(canal != "email") return res.status(404).json({status:false, message:'Impossible de poursuivre cette requette.'});
            // Si le canal est celui des adresses emails, on stocke le nom de l'entreprise et les informations à transferer dans une constante donneEmail
            const donneEmail={ plateforme:verifCompagny.raisonSociale, contenu };
            // On établie la connexion auserveur de messagerie ootlmail
            const connection = transporteur({ user: verifCompagny.emailInfo, pass: verifCompagny.passwordEmailInfo});
            const attachements = [];
            if(req.files){
                req.files.map( piece =>{
                    attachements.push({
                        filename: piece.path,
                        path: req.protocol+"://"+req.get("host")+"/"+piece.path,
                        cid: piece.filename
                    });
                })
            };
            const datas = {
                // On définit le nom et d'adresse au destinataire
                from: `"${verifCompagny.raisonSociale}" <${verifCompagny.emailInfo}>`,
                // On fait une copie des adresse en caché de sorte que l'receveur n'arrive pas à avoir connaissance aux autres qui ont réçu le même message 
                bcc: contact,
                // On définit l'objet du message
                subject:req.body.subject,
                // On transmettre le contenu au format html
                html: htmlFormatEmail(donneEmail),
                attachments: attachements
            };
            if(!req.files) delete datas.attachments;
            // On transmet le message aux contacts
            const sendEmail = await connection.sendMail(datas);
            // On le serveur n'a pas accès à la connexion internet on renvoie un message au client consernant la connexion
            if(!sendEmail.response.includes("OK")) return res.status(400).json({message: "Connexion interrompue.", statut:false, error});
            // Sinon on lui envoie une réponse favrable
            return res.status(201).json({message: "Message transféré avec succès !", statut:true})
        }catch(e){
            console.log(e)
            res.status(500).json({status:false , message: e.message, error:e})
        }
    }
}
export default MessageController