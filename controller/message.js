import Agent from '../models/agent.js'
import Entreprise  from '../models/entreprise.js';
import User from '../models/user.js'
import { verifEmail } from '../util/verifEmail.js';
import { sendEmail } from '../util/sendMail.js';
import htmlFormatEmail from "../mailling/htmlFormatEmail.js";
import transporteur from "../mailling/transporteur.js";
import verify_email_adress from '../laboratoire/verify_email_adress.js';




class Message{
    static async createEmail(req,res){
        try{
            let verifUser = {}
            const {_id, entreprise, role} = req.auth;

            const {canal, piecesJointes, contenu, contact} = req.body;
            // On vérifie si la constante contact est un un tableau qui contient au moins un adresse email
            if(!Array.isArray(contact) || !contact.some(item=>verify_email_adress(item))) return res.status(400).json({message: "Les contacts chargés ne contiennent aucun adresse mail.", status: false})
            // On tente de récupérer les informations de l'entréprise dans la base de données
            const verifCompagny = await Entreprise.findById(entreprise);
            // Si la l'entréprise n'existe pas dans la base de données, on renvoie un message au client
            if(!verifCompagny) return res.status(404).json({status:false,message:'Entreprise introuvable'});
            /**Si l'entreprise existe, on vérifie si celui qui effectue la requette est le chef d'entreprise, sinon il devra être un employé de l'entreprise
             * et on tente de recupèrer  les information de ce employé dans la base données
            */
            verifUser = role !=="Proprio"? await Agent.findById(_id): await User.findById(_id);
            // Si ce employé n'est belle pas dans la base de données, on renvoie un message au client
            if(!verifUser) return res.status(404).json({status:false, message:'Compte introuvable'});
            // Sinon, on vérifie si le canal de difision n'est pas celui du canal email on renvoie un message au client
            if(canal != "email") return res.status(404).json({status:false, message:'Impossible de poursuivre cette requette.'});
            // Si le canal est celui des adresses emails, on stocke le nom de l'entreprise et les informations à transferer dans une constante donneEmail
            const donneEmail={ plateforme:verifCompagny.raisonSociale, contenu };
            // On établie la connexion auserveur de messagerie ootlmail
            const connection = transporteur({ user: `${verifCompagny.emailInfo}`, pass: `${verifCompagny.passwordEmailInfo}`});
            // On transmet le message aux contacts
            const email = await connection.sendMail({
                // On définit le nom et d'adresse au destinataire
                from: `"${verifCompagny.raisonSociale}" <${verifCompagny.emailInfo}>`,
                // On fait une copie des adresse en caché de sorte que l'receveur n'arrive pas à avoir connaissance aux autres qui ont réçu le même message 
                bcc: contact.filter(item=>verify_email_adress(item)),
                // On définit l'objet du message
                subject:req.body.subject,
                // On transmettre le contenu au format html
                html: htmlFormatEmail(donneEmail)
            });
            // On le serveur n'a pas accès à la connexion internet on renvoie un message au client consernant la connexion
            if(!email.response.includes("OK")) return res.status(400).json({message: "Connexion interrompue.", statut:false, error});
            // Sinon on lui envoie une réponse favrable
            return res.status(201).json({message: "Message transféré avec succès !", statut:true})
        }
        catch(e){
            console.log(e.message)
            res.status(500).json({status:false , message: e.message})
        }
    }
}
export default Message