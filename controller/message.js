import Agent from '../models/agent.js';
import Entreprise  from '../models/entreprise.js';
import User from '../models/user.js';
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
import wbm from 'wbm';
import verify_number from '../laboratoire/verify_number.js';
import Contact from '../models/contact.js';
import Message from '../models/message.js';
import Groupe from '../models/groupe.js';
import mongoose from 'mongoose';
import Administrateur from '../models/administrateur.js';

import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
import { SendMessageBusness } from '../laboratoire/dataMetaBusness.js';












const urlFont = 'http://localhost:5173/entreprise';

class MessageController{
    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async create(req, res){
        try {
            const {_id, entreprise, email} = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            if(!isUser && !isAgent) return res.status(403).json({message: 'vous n\'êtes pas authorisé(s) à effectuer cette requête: Mot de passe ou email incorrects', status: false});
            const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
            if(!isEntreprise) return res.status(403).json({message: 'vous n\'êtes pas authorisé(s) à effectuer cette requête: Vous n\'êtes pas membre de l\'entreprise', status: false});
            if(!Array.isArray(req.body.groupe) && typeof(req.body.groupe) === 'string') req.body.groupe = req.body.groupe.split(',');
            else if(!Array.isArray(req.body.contact) && typeof(req.body.contact)=== 'string') req.body.contact = req.body.contact.split(',');
            const idCollection = [];
            let newCollections = [];
            const idObjetCollection = [];
            
            if(req.body.groupe && req.body.groupe.length){
                let myGroupes = await Groupe.find({entreprise, statut: 1});
                if(!myGroupes.length) return res.status(403).json({message: 'Vous ne disposez aucun groupe.', status: false});
                myGroupes.map(item=> idCollection.push(item._id.toString()));
                newCollections = req.body.groupe.filter(item=> idCollection.includes(item));
                if(!newCollections.length) return res.status(403).json({message: 'Les contacts ou groupe n\'existent pas', status: false});
                newCollections.map(item => idObjetCollection.push(new mongoose.Types.ObjectId(item)));
                req.body.groupe = idObjetCollection;
            }else if(req.body.contact && req.body.contact.length){
                let myContacts = await Contact.find({entreprise, statut: 1});
                if(!myContacts.length) return res.status(403).json({message: 'Vous ne disposez aucun contact.', status: false});
                myContacts.map(item => idCollection.push(item._id.toString()));
                newCollections = req.body.contact.filter(item => idCollection.includes(item) );
                if(!newCollections.length) return res.status(403).json({message: 'Les contacts ou groupe n\'existent pas', status: false});
                newCollections.map(item => idObjetCollection.push(new mongoose.Types.ObjectId(item)));
                req.body.contact = idObjetCollection;
            }
            
            if(req.files){
                req.body.piecesJointes = [];
                req.files.map(piece => req.body.piecesJointes.push(
                    {
                        filename: piece.path,
                        path: req.protocol+"://"+req.get("host")+"/"+piece.path,
                        cid: piece.filename
                    }
                ))
            };
            req.body.entreprise = isEntreprise._id;
            isUser ? req.body.user = isUser._id : req.body.agent = isAgent._id;
            delete req.body.statut;
            const newMessage = await Message.create(req.body);
            res.status(201).json({message: 'Message créer avec succès', status: false, data: newMessage})
        } catch (error) {
            console.log(error.message, error);
            res.status(500).json({ status: false, message: error.message });
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getAll(req, res) {
        try {
            const { _id, email, entreprise, plateforme } = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
            let isStructure, isMember, resultat = [];
            if(!isUser && !isAgent && !isAdmin) return res.status(203).json({message: "Mot de passe ou email incorrects.", status: false});
            isMember = isUser || isAgent;
            if(isMember){
            isStructure = await Entreprise.findOne({_id:isMember.entreprise, statut: 1});
            if(isStructure) resultat = await Message.find({entreprise: isStructure._id, statut: 1}).populate('entreprise').populate('user').populate('agent');
            }else{
            isStructure = await Plateforme.findOne({_id:isAdmin.plateforme._id});
            if(isStructure) resultat = await Message.find({ statut: 1 }).populate('groupe').populate('contact').populate('user').populate('agent').populate('entreprise');
            }
            if(!isStructure) return res.status(203).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
            if(!resultat.length) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
            return res.status(202).json({message: "Requête traitée avec succès.", total: resultat.length, status: true, data:resultat});
        } catch (e) {
          console.log(e);
          res.status(500).json({ status: false, message: e.message });
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getById(req, res){
        try {
            const { _id, email, entreprise, plateforme } = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
            let isMessage = undefined;
            let isCompagny = undefined;
            if(!isUser && !isAgent && !isAdmin) return res.status(402).json({message: "Mot de passe ou email incorrects.", status: false});
            
            if(isUser || isAgent){
                isCompagny = await Entreprise.findOne({_id: entreprise, statut: 1});
                if(!isCompagny) return res.status(402).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
                isMessage = await Message.findOne({_id:req.params.id, entreprise, statut: 1}).populate('entreprise').populate('groupe').populate('contact');
            } else{
                isCompagny = await Plateforme.findOne({_id: plateforme, statut: 1});
                if(!isCompagny) return res.status(402).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
                isMessage = await Message.findOne({_id:req.params.id, statut: 1}).populate('groupe').populate('contact').populate('user').populate('agent').populate('entreprise');;
            }
            if(!isMessage) return res.status(402).json({message: "Ce message n'existe pas.", status: false});
            res.status(202).json({message: "Requête traitée avec succès.",  status: true, data: isMessage});
        } catch (error) {
            console.log('Try catch(500)', '\n', error, '\n', error.message,);
            res.status(500).json({message: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getByName(req, res){
        try {
            const { _id, email, entreprise, plateforme } = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
            let isMessage = undefined;
            let isCompagny = undefined;
            if(!isUser && !isAgent && !isAdmin) return res.status(402).json({message: "Mot de passe ou email incorrects.", status: false});
            if(isUser || isAgent){
                isCompagny = await Entreprise.findOne({_id: entreprise, statut: 1});
                if(!isCompagny) return res.status(402).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
                isMessage = await Message.find({entreprise, statut: 1}).populate('entreprise');
            } else{
                isCompagny = await Plateforme.findOne({_id: plateforme, statut: 1});
                if(!isCompagny) return res.status(402).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
                isMessage = await Message.find({statut: 1}).populate('groupe').populate('contact').populate('user').populate('agent').populate('entreprise');
            } 
            if(!isMessage.length) return res.status(402).json({message: "Message non trouvé.", status: false});
            isMessage = isMessage.filter(item => item.object.includes(req.params.object) && item.entreprise._id === entreprise);
            if(!isMessage.length) return res.status(402).json({message: "Message non trouvé.", status: false});
            res.status(202).json({message: "Requête traitée avec succès.",  status: true, data: isMessage});
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async update(req, res){
        try {
            const {_id, entreprise, email} = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            if(!isUser && !isAgent) return res.status(403).json({message: 'vous n\'êtes pas authorisé(s) à effectuer cette requête: Mot de passe ou email incorrects', status: false});
            const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
            if(!isEntreprise) return res.status(403).json({message: 'vous n\'êtes pas authorisé(s) à effectuer cette requête: Vous n\'êtes pas membre de l\'entreprise', status: false});
            const hasMessage = await Message.findOne({_id: req.params.id, entreprise, statut: 1});
            if(!hasMessage) return res.status(403).json({message: 'Le message à modifier n\'est pas disponible.', status: false});
            if(!req.body.canal) req.body.canal = hasMessage.canal;
            if(!Array.isArray(req.body.groupe) && typeof(req.body.groupe) === 'string') req.body.groupe = req.body.groupe.split(',');
            else if(!Array.isArray(req.body.contact) && typeof(req.body.contact)=== 'string') req.body.contact = req.body.contact.split(',');
            const idCollection = [];
            let newCollections = [];
            const idObjetCollection = [];
            if(req.body.groupe && req.body.groupe.length){
                let myGroupes = await Groupe.find({entreprise, statut: 1});
                if(!myGroupes.length) return res.status(403).json({message: 'Vous ne disposez aucun groupe.', status: false});
                myGroupes.map(item=> idCollection.push(item._id.toString()));
                newCollections = req.body.groupe.filter(item=> idCollection.includes(item));
                if(!newCollections.length) return res.status(403).json({message: 'Les contacts ou groupe n\'existent pas', status: false});
                newCollections.map(item => idObjetCollection.push(new mongoose.Types.ObjectId(item)));
                req.body.groupe = idObjetCollection;
            }else if(req.body.contact && req.body.contact.length){
                let myContacts = await Contact.find({entreprise, statut: 1});
                if(!myContacts.length) return res.status(403).json({message: 'Vous ne disposez aucun contact.', status: false});
                myContacts.map(item => idCollection.push(item._id.toString()));
                newCollections = req.body.contact.filter(item => idCollection.includes(item) );
                if(!newCollections.length) return res.status(403).json({message: 'Les contacts ou groupe n\'existent pas', status: false});
                newCollections.map(item => idObjetCollection.push(new mongoose.Types.ObjectId(item)));
                req.body.contact = idObjetCollection;
            }
            if(req.files){
                req.body.piecesJointes = [];
                req.files.map(piece => req.body.piecesJointes.push(
                    {
                        filename: piece.path,
                        path: req.protocol+"://"+req.get("host")+"/"+piece.path,
                        cid: piece.filename
                    }
                ))
            }
            req.body.entreprise = isEntreprise._id;
            isUser ? req.body.user = isUser._id : req.body.agent = isAgent._id;
            delete req.body.statut;
            delete req.body._id;

            for (const key in req.body) {
                if(!req.body[key]) delete req.body[key]
            }

            const newMessage = await Message.updateOne({_id: req.params.id, entreprise, statut:1},req.body);
            res.status(201).json({message: 'Message créer avec succès', status: false, data: newMessage})
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async updateSendingMessage(req, res){
        try {
            const {_id, entreprise, email} = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            if(!isUser && !isAgent) return res.status(403).json({message: 'vous n\'êtes pas authorisé(s) à effectuer cette requête: Mot de passe ou email incorrects', status: false});
            const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
            if(!isEntreprise) return res.status(403).json({message: 'vous n\'êtes pas authorisé(s) à effectuer cette requête: Vous n\'êtes pas membre de l\'entreprise', status: false});
            const hasMessage = await Message.findOne({_id: req.params.id, entreprise, statut: 1});
            if(!hasMessage) return res.status(403).json({message: 'Le message à modifier n\'est pas disponible.', status: false});
            
            req.body.entreprise = isEntreprise._id;
            isUser ? req.body.user = isUser._id : req.body.agent = isAgent._id;
            delete req.body.statut;
            delete req.body._id;

            const newMessage = await Message.updateOne({_id: req.params.id, entreprise, statut:1}, {statut: 2});
            res.status(201).json({message: 'Message créer avec succès', status: false, data: newMessage});
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async delete(req, res){
        try {
            const { _id, email, entreprise } = req.auth;
            const isUser = await User.findOne({_id, email, entreprise, statut: 1});
            const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
            let isMessage = undefined;
            let isCompagny = undefined;
            if(!isUser && !isAgent) return res.status(402).json({message: "Mot de passe ou email incorrects.", status: false});
            isCompagny = await Entreprise.findOne({_id: entreprise, statut: 1});
            if(!isCompagny) return res.status(402).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
            isMessage = await Message.findOne({_id: req.params.id, entreprise, statut: 1});
            if(!isMessage) return res.status(402).json({message: "Le message à modifier n'existe pas.", status: false});
            delete req.body._id;
            for (const key in req.body) {
                if(!req.body[key]) delete req.body[key];
            }
            const updated = await Message.updateOne({_id: req.params.id, entreprise, statut: 1}, {statut: 0});
            if(!updated.acknowledged || !updated.modifiedCount) return res.status(203).json({statut: false, message: "Suppression non effectuée."});
            res.status(202).json({ status:true, message: "Suppression effectuée avec succès !", status: true});
        } catch (error) {
            res.status(500).json({message: error.message, status: false});
        }
    }

    static async verifyEmail(req, res){
        try {
            
            // On récupère le destinataire dans la base de données
            const user = await User.findOne({email: req.body.email});
            // Si le destinataire existe on interrompe l'envoie du mail en envoyant un message au client pour informer que le compte est utilisé
            if(user) return res.status(400).json({message: "Ce compte est déjè utilisé.", statut:false});
            // Si le destinataire n'existe pas dans la base de données on tente de récpérer l'expéditeur dans la base de données
            const plateforme = await Plateforme.find();
            // Si l'expéditeur n'existe pas on interrompe la suite du traitement en envoyant un message au client
            if(!plateforme.length) return res.status(400).json({message: "Service momentanement indisponible !", statut:false});
            // Si l'expéditeur existe en génère de manière aléatoire un code de 6 chiffre dont le premier chiffre est difference de 0
            req.body.code = generateRandomString("0123456789", 6);
            const isTry = await ValidateCode.findOne({email: req.body.email});
            if(isTry) return res.status(203).json({message: "Veuillez confirmer l'email de validation"})
            const valide = await ValidateCode.findOne({email: req.body.email});
            if(valide) return res.status(401).json({message: 'Veuillez confirmer votre email', status: false});
            const url = req.body.urlfrontend+`/?${req.body.code}#${req.body.email}`;
            // On met en forme l'information à transmettre
            const donneEmail={ fullname:req.body.fullname, plateforme:plateforme[0].raisonSociale, url, code:req.body.code };
            
            // On établie la connexion au serveur de méssagerie ootlmail
            const connection = transporteur({ user: `${plateforme[0].emailInfo}`, pass: `${plateforme[0].passwordEmailInfo}`});
            // On transmet l'information de l'expéditeur vers le receveur
            const email = await connection.sendMail({
                from: `${plateforme[0].raisonSociale} <${plateforme[0].emailInfo}>`,
                bcc: [req.body.email],
                subject:"VALIDATION DE SECURITE",
                html: code_auth(donneEmail)
            });
            // Si l'expéditeur n'a pas accès à la connexion internet on envoie un message au client
            if(!email.response.includes("OK")) return res.status(400).json({message: "Connexion interrompue.", statut:false, error});
            const validate = await ValidateCode.create(req.body);
            // Sinon on retourne le code de validation au client.
            return res.status(201).json({message: "Code de validation unique.", code: validate.code, data: validate, statut:true})
        } catch (error) {
            console.log(error)
            // Si un problème survient au niveau du serveur, on retourne un message
            res.status(501).json({message:"Traitement de la demande a été interrompu.", statut:false, error});
        }
    }

    static async createEmail(req,res){
        try{
            const {_id, entreprise} = req.auth;
            
            let {canal, contenu, contact} = req.body;
            // On vérifie si la constante contact est un tableau qui contient au moins un adresse email
            if(!(Array.isArray(contact) && contact.some(emailAdress =>verify_email_adress(emailAdress)) || (typeof(contact)=="string" && verify_email_adress(contact)))) return res.status(400).json({message: "Les contacts chargés ne contiennent aucun adresse mail.", status: false});
            // On tente de récupérer les informations de l'entréprise dans la base de données
            if(Array.isArray(contact) && contact.some(emailAdress =>verify_email_adress(emailAdress))) contact = contact.filter(item=>verify_email_adress(item));
            
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
            if(!verifCompagny.password) return res.status(402).json({message: 'Impossible de se connecter au serveur de messagerie, Veuillez rattacher le mot de passe de connexion au serveur de messagerie !', statut: false})
            // const connection = transporteur({ user: verifCompagny.email, pass: verifCompagny.password});
            const connection = transporteur({ user: 'nfcdjobo', pass: 'y f m d s f z e e t s g t t j f'});
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
            // console.table([verifCompagny.raisonSociale, verifCompagny.email, req.body]);
            const datas = {
                // On définit le nom et d'adresse au destinataire
                from: `'${verifCompagny.raisonSociale}' <${verifCompagny.email}>`,
                // On fait une copie des adresse en caché de sorte que l'receveur n'arrive pas à avoir connaissance aux autres qui ont réçu le même message 
                bcc: contact,
                // On définit l'objet du message
                subject:req.body.object,
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

    static async sendWhatsAppMessage(req, res){
        try {
            const {_id, entreprise} = req.auth;
            const { Client, LocalAuth } = pkg;
            let {message} = req.body;
            const verifCompagny = await Entreprise.findOne({_id:entreprise, statut: 1});
            if(!verifCompagny) return res.status(404).json({status:false,message:'Entreprise introuvable'});
            const isMember =  await Agent.findOne({_id, entreprise, statut: 1}) || await User.findOne({_id, entreprise, statut: 1});
            // Si ce employé n'est belle pas dans la base de données, on renvoie un message au client
            if(!isMember) return res.status(404).json({status:false, message:'Compte introuvable'});
            const FindMessage = await Message.findOne({_id: message, entreprise, canal:'whatsapp', statut: 1}).populate('groupe').populate('contact');
            // Sinon, on vérifie si le canal de difision n'est pas celui du canal email on renvoie un message au client
            if(!FindMessage) return res.status(400).json({status:false, message:'Ce message non trouvé.'});

            let {contact, groupe, contenu, piecesJointes, object} = FindMessage;
            let ThisContactsOrGroupe = [];
            if(contact.length){
                ThisContactsOrGroupe.push(...contact.map(item => item.whatsapp));
            }else if(groupe.length){
                groupe.map( async item => {
                    const ThisSomeGroupe = await Groupe.findOne({_id: item._id, entreprise, statut: 1}).populate('contact');
                    const ThisContact = ThisSomeGroupe.contact.map(ele => ele.whatsapp);
                    ThisContactsOrGroupe.push(...ThisContact);
                })
            }

            if(!ThisContactsOrGroupe.length) return res.status(404).json({status:false, message:'Vous contacts ne sont pas conforment.'});
            
            wbm.start().then(async () => {
                const sending = await wbm.send(ThisContactsOrGroupe, contenu);
                if(!sending) res.status(501).json({message:"Traitement a été interrompu.", status:false});
                const finish = await wbm.end();
                res.status(202).json({message:"Message envoyé.", status:true, sending, finish});
            }).catch(err => { console.log(err); });

            wbm.start().then(async () => {
                const sending = await wbm.send(ThisContactsOrGroupe, contenu);
                if(!sending) {
                    res.status(501).json({ message: "Traitement a été interrompu.", status: false });
                }else {
                    const finish = await wbm.end();
                    res.status(202).json({ message: "Message envoyé.", status: true, sending, finish });
                }
            }).catch(err => {
                console.log('************',err);
                res.status(501).json({ message: "Traitement de la demande a été interrompu.", status: false, error: err.message });
            });

            /** const whatsapp = new Client({
                authStrategy: new LocalAuth()
            });

            whatsapp.on('qr', qr => {
                qrcode.generate(qr, {
                    small: true
                })
            })

            whatsapp.on('ready', () => {
                console.log('Le serveur est prêt !');
            });

            whatsapp.on('message', async msg => {
                if (msg.body == '!ping') {
                    msg.reply('pong');
                }
            });

            whatsapp.initialize();*/


            ThisContactsOrGroupe.forEach(adress => {
                SendMessageBusness('+15551335562'/**verifCompagny.whatsapp*/, adress, FindMessage.contenu)
            })
            


            // const accessToken = 'EABpkKkSffjUBO0ehVQ4OpACXbo9psfYY5ZBOZAs6OsZAkRqxYPck52LwSRzjsgE6aM0ZCeamOHaNidAb58KmGYKUyiRTPRsde06KaT2VSZCdBP0tdHnjlkPDl0syXcD4YtPjwnupGgj9iZByMdA5DzXioKdjcAXp3AMgTfV08ZBA44uzbWME2SN6utUrN7jfxuVxhrWUDDODaZC6mHCANbUN';
            // const recipientWhatsAppNumber = 'NUMERO_WHATSAPP_DESTINATAIRE';
            // const senderWhatsAppNumber = 'NUMERO_WHATSAPP_EXPEDITEUR';

            // const data = {
            //     messaging_product: 'whatsapp',
            //     to: verifCompagny.whatsapp,
            //     from: ThisContactsOrGroupe, // Ajoutez cette ligne pour spécifier l'expéditeur
            //     type: 'template',
            //     template: {
            //         name: 'hello_world',
            //         language:{ code: 'en_US' },
            //         components: [
            //             {
            //                 type: "TEXT",
            //                 text: FindMessage.contenu,
            //             },
            //             {
            //                 type: "BUTTON",
            //                 text: "Learn more",
            //                 payload: "learn_more"
            //             }
            //         ]
            //     }
            // };

            // const headers = {
            // 'Authorization': `Bearer ${accessToken}`,
            // 'Content-Type': 'application/json'
            // };

            // const sending = await axios.post(apiUrlMetaBusness, data, { headers })
            // .then(response => {
            //     console.log('Réponse de l\'API:', response.data);
            // })
            // .catch(error => {
            //     console.error('Erreur lors de la requête API:', error.response.data || error.message);
            // });


        } catch (error) {
            console.log('00000000000',error);
            res.status(501).json({message:"Traitement de la demande a été interrompu.", status:false, error});
        }
    }



np}
export default MessageController;