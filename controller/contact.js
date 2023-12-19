// import contact from "../models/contact.js";
import Contact from "../models/contact.js";
import User from "../models/user.js";
import Entreprise from "../models/entreprise.js";
import Agent from "../models/agent.js";
import Administrateur from "../models/administrateur.js";
import Plateforme from "../models/plateforme.js";
import verify_email_adress from "../laboratoire/verify_email_adress.js";

import csvParser from "csv-parser";
import path from "path";
import xlsToJson  from "xls-to-json";

import fs from 'fs-extra';
import excelToJson from "convert-excel-to-json";
import FormateData from "../laboratoire/FormateData.js";

class ControlContact {

  /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async create(req, res) {
    try {
      const { _id, email, entreprise } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      if(isUser) req.body.user = isUser._id;
      if(isAgent) req.body.agent = isAgent._id;
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(401).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
      if(!isEntreprise) return res.status(402).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
      const isPresent = await Contact.findOne({email: req.body.email, statut: 1});
      if(isPresent) return res.status(400).json({message: "Ce contact est déjà ajouté", status: false});
      req.body.entreprise = isEntreprise._id;
      const contact = await Contact.create(req.body);
      if(!contact) return res.status(403).json({message: "Enregistrement avorté avec succès.", status: false});
      res.status(202).json({data: contact, message: "Enregistrer effectué avec succès.", status:true});
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }
  }


  /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async saveContentFileToJson(req, res) {
    try {
      console.log(req.file)
      const { _id, email, entreprise } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      if(isUser) req.body.user = isUser._id;
      if(isAgent) req.body.agent = isAgent._id;
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(401).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
      if(!isEntreprise) return res.status(402).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
      req.body.entreprise = isEntreprise._id;
      const isPresent = await Contact.findOne({email: req.body.email, statut: 1});
      if(isPresent) return res.status(400).json({message: "Ce contact est déjà ajouté", status: false});
      if(!req.file) return res.status(403).json({message: 'Aucun ficher present', status: false});
      const myFile = req.file;
      const extension = path.extname(myFile.path);
      let Results = [];
      const Collections = [];
      if(fs.existsSync(myFile.path)){
        if(extension === '.csv'){
          console.log('Results');
          fs.createReadStream(myFile.path)
            .pipe(csvParser())
            .on('data', async data => Results.push(data))
            .on('end', async () => {
              if (!Results.length) return res.status(402).json({ message: 'Aucun contact ajouté, contenu du fichier vide !', status: false });
              await FormateData(Results, Contact, req, Collections);
              setTimeout(() => {
                if(!Collections.length) return res.status(403).json({message: 'Aucun contact ajouté, il se peut que ce(s) contact existent au préalable !', status: false});
                res.status(202).json({message: 'Contact(s) importé(s) avec succès !', status: true, data: Collections})
              }, 1000)
            });
        }else if(extension === '.xlsx'){ 
          const excelData = excelToJson({
            sourceFile: myFile.path,
            header: {rows : 1},
            columnToKey: {"*": "{{columnHeader}}"}
          });
          for (const reff in excelData) {
            if (Object.hasOwnProperty.call(excelData, reff)) {
              await FormateData(excelData[reff], Contact, req, Collections);
            }
          }
          setTimeout(() => {
            if(!Collections.length) return res.status(403).json({message: 'Aucun contact ajouté, il se peut que ce(s) contact existent au préalable !', status: false});
            res.status(202).json({message: 'Contact(s) importé(s) avec succès !', status: true, data: Collections});
          }, 1000);
        }else if(extension === '.xls'){
          xlsToJson({
            input: myFile.path,
            output: null,        
          }, function async (err, jsonData) {
            if (err) {
                console.error(err);
                res.status(500).send('Erreur lors de la conversion du fichier XLS.');
            } else {
              FormateData(jsonData, Contact, req, Collections);
              setTimeout(() => {
                if(!Collections.length) return res.status(403).json({message: 'Aucun contact ajouté, il se peut que ce(s) contact existent au préalable !', status: false});
                res.status(202).json({message: 'Contact(s) importé(s) avec succès !', status: true, data: Collections});
              }, 1000);
            }
        });
        }
      }else{
        res.status(404).json({ status: false, message: 'Fichier non trouvé' });
      }
      fs.remove(myFile.path);
    } catch (e) {
      console.log( e);
      res.status(501).json({ status: false, message: e.message });
    }
  }


  /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async getById(req, res){
    try {
      const { _id, email, entreprise } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(403).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
      if(!isEntreprise) return res.status(403).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
      const contact = await Contact.findOne({_id: req.params.id, entreprise:isEntreprise._id, statut:1}).populate('entreprise').populate('user').populate('agent');
      if(!contact) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", status: true, data: contact});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async getByEmail(req, res){
    try {
      const { _id, email, entreprise } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(403).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
      if(!isEntreprise) return res.status(403).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
      const contact = await Contact.findOne({_id: req.params.email, entreprise:isEntreprise._id, statut:1}).populate('entreprise').populate('user').populate('agent');
      if(!contact) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", status: true, data: contact});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async getContactEmail(req, res){
    try {
      const { _id, email, entreprise, plateforme } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      let structure, contact, resultat=[];
      
      if(!isUserOrIsAgent && !isAdmin) return res.status(403).json({message: "Mot de passe ou email incorrects !", status: false});
      if(isUserOrIsAgent){
        structure = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
        if(!structure) return res.status(403).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
        contact = await  Contact.find({entreprise:structure._id, statut:1 }).populate('entreprise').populate('user').populate('agent');
      }else{
        const 
        structure = await Plateforme.findOne({_id: isAdmin.plateforme._id});
        if(!structure) return res.status(403).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
        contact = await  Contact.find({ statut:1 }).populate('entreprise').populate('user').populate('agent');
      }

      if(!contact.length) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      contact.map(element => {
        if(verify_email_adress(element.email)){
          const {fullname, email} = element;
          resultat.push({fullname:fullname, email:email});
        }
      })

      if(!resultat.length) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", total:resultat.length, status: true, data: resultat});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

    /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async update(req, res) {
    try {
      const { _id,  entreprise} = req.auth;
      const { id } = req.params;
      const isUser = await User.findOne({_id, email: req.auth.email, entreprise, statut: 1});
      const isAgent = await User.findOne({_id, email: req.auth.email, entreprise, statut: 1});
      if(isUser) req.body.user = isUser._id;
      if(isAgent) req.body.agent = isAgent._id;
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(403).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
      if(!isEntreprise) return res.status(403).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
      const isPresent = await Contact.findOne({_id: id, entreprise:isEntreprise._id, statut: 1});
      if(!isPresent) return res.status(403).json({message: "Ce contact n'existe pas.", status: false});
      req.body.entreprise = isEntreprise._id;
      delete req.body.statut;
      delete req.body._id;
      const updated = await Contact.updateOne({_id:isPresent, entreprise:isEntreprise._id, statut:1}, req.body);
      if(!updated.acknowledged || !updated.modifiedCount) return res.status(403).json({statut: false,message: "Modification non effectué."});
      res.status(201).json({message: "Modification effectué avec succès", status: true});
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }
  }

    /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async delete(req, res) {
    try {
      const { _id,  entreprise} = req.auth;
      const { id } = req.params;
      const isUser = await User.findOne({_id, email: req.auth.email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email: req.auth.email, entreprise, statut: 1});
      if(isUser) req.body.user = isUser._id;
      if(isAgent) req.body.agent = isAgent._id;
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(403).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
      if(!isEntreprise) return res.status(403).json({message: "Vous ne faites pas partie d'aucune entreprise.", status: false});
      const isPresent = await Contact.findOne({_id: id, entreprise:isEntreprise._id, statut: 1});
      if(!isPresent) return res.status(403).json({message: "Ce contact n'existe pas.", status: false});
      const deleted = await Contact.updateOne({_id:isPresent, entreprise:isEntreprise._id, statut:1}, {statut: 0, updatedAt: Date.now()});
      if(!deleted.acknowledged || !deleted.modifiedCount) return res.status(403).json({statut: false,message: "Modification non effectué."});
      res.status(201).json({message: "Modification effectué avec succès", status: true});
    } catch (e) {
      res.status(500).json({ status: false, message: e.message,});
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
      if(!isUser && !isAgent && !isAdmin) return res.status(403).json({message: "Mot de passe ou email incorrects.", status: false});
      isMember = isUser || isAgent;
      
      if(isMember){
        
        isStructure = await Entreprise.findOne({_id:isMember.entreprise, statut: 1});
        if(isStructure) resultat = await Contact.find({entreprise: isStructure._id, statut: 1}).populate('entreprise').populate('user').populate('agent');
      }else{
        isStructure = await Plateforme.findOne({_id:isAdmin.plateforme._id});
        if(isStructure) resultat = await Contact.find({ statut: 1 }).populate('entreprise').populate('user').populate('agent');
      }
      if(!isStructure) return res.status(403).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
      
      if(!resultat.length) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      // console.log(resultat);
      return res.status(202).json({message: "Requête traitée avec succès.", total: resultat.length, status: true, data: resultat});
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
  static async getContactWhatsApp(req, res){
    try {
      const { _id, email, entreprise, plateforme } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      let structure, contact, resultat=[];
      
      if(!isUserOrIsAgent && !isAdmin) return res.status(403).json({message: "Mot de passe ou email incorrects !", status: false});
      if(isUserOrIsAgent){
        structure = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
        if(!structure) return res.status(403).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
        contact = await  Contact.find({entreprise:structure._id, statut:1 }).populate('entreprise').populate('user').populate('agent');
      }else{
        structure = await Plateforme.findOne({_id: isAdmin.plateforme._id});
        if(!structure) return res.status(403).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
        contact = await  Contact.find({ statut:1 }).populate('entreprise').populate('user').populate('agent');
      }

      if(!contact.length) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      contact.map(element => {
          const {fullname, numeroWhatsapp} = element;
          if(numeroWhatsapp){
            resultat.push({fullname:fullname, WhatasApp:numeroWhatsapp});
          }
      })

      if(!resultat.length) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", total:resultat.length, status: true, data: resultat});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async getContactSMS(req, res){
    try {
      const { _id, email, entreprise, plateforme } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      let structure, contact, resultat=[];
      
      if(!isUserOrIsAgent && !isAdmin) return res.status(403).json({message: "Mot de passe ou email incorrects !", status: false});
      if(isUserOrIsAgent){
        structure = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
        if(!structure) return res.status(403).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
        contact = await  Contact.find({entreprise:structure._id, statut:1 }).populate('entreprise').populate('user').populate('agent');
      }else{
        structure = await Plateforme.findOne({_id: isAdmin.plateforme._id});
        if(!structure) return res.status(403).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
        contact = await  Contact.find({ statut:1 }).populate('entreprise').populate('user').populate('agent');
      }

      if(!contact.length) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      contact.map(element => {
          const {fullname, numeroSms} = element;
          if(numeroSms)resultat.push({fullname:fullname, smsNumber:numeroSms});
      })

      if(!resultat.length) return res.status(403).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", total:resultat.length, status: true, data: resultat});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  static async importContact(req, res) {
    try {
      const { _id, entreprise } = req.auth;
      const body = [...req.body];
      const verif = body.map((ele) => { 
        let newCont = {}; 
        const contactExist = Contact.findOne({ email: ele.email, entreprise: entreprise[0]._id });
        if (contactExist) { 
          newCont = { ...ele };
          return newCont; 
        } else { return ele; }
      });
      const importy = await Contact.create(...verif);
      if (!importy) return res.status(404).json({ status: 200, message: "Erreur d'enregistrement." })
      res.status(200).json({ status: true, message: "enregistrement effectue"});
    } catch (e) {
      res.status(500).json({ status: false, message: e.message});
    }
  }
}

export default ControlContact;
