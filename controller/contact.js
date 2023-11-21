// import contact from "../models/contact.js";
import Contact from "../models/contact.js";
import User from "../models/user.js";
import Entreprise from "../models/entreprise.js";
import Agent from "../models/agent.js";
import Administrateur from "../models/administrateur.js";
import Plateforme from "../models/plateforme.js";
import verify_email_adress from "../laboratoire/verify_email_adress.js";

class ControlContact {
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
      if(!contact) return res.status(203).json({message: "Enregistrement avorté avec succès.", status: false});
      res.status(202).json({data: contact, message: "Enregistrer effectué avec succès.", status:true});
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }
  }

  static async getById(req, res){
    try {
      const { _id, email, entreprise } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
      if(!isEntreprise) return res.status(203).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
      const contact = await Contact.findOne({_id: req.params.id, entreprise:isEntreprise._id, statut:1}).populate('entreprise').populate('user').populate('agent');
      if(!contact) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", status: true, data: contact});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  static async getByEmail(req, res){
    try {
      const { _id, email, entreprise } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
      if(!isEntreprise) return res.status(203).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
      const contact = await Contact.findOne({_id: req.params.email, entreprise:isEntreprise._id, statut:1}).populate('entreprise').populate('user').populate('agent');
      if(!contact) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", status: true, data: contact});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  static async getContactEmail(req, res){
    try {
      const { _id, email, entreprise, plateforme } = req.auth;
      
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      let structure, contact, resultat=[];
      
      if(!isUserOrIsAgent && !isAdmin) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
      if(isUserOrIsAgent){
        structure = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
        if(!structure) return res.status(203).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
        contact = await  Contact.find({entreprise:structure._id, statut:1 }).populate('entreprise').populate('user').populate('agent');
      }else{
        const 
        structure = await Plateforme.findOne({_id: isAdmin.plateforme._id});
        console.log(isAdmin.plateforme._id)
        if(!structure) return res.status(203).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
        contact = await  Contact.find({ statut:1 }).populate('entreprise').populate('user').populate('agent');
      }

      if(!contact.length) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      contact.map(element => {
        if(verify_email_adress(element.email)){
          const {fullname, email} = element;
          resultat.push({fullname:fullname, email:email});
        }
      })

      if(!resultat.length) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", total:resultat.length, status: true, data: resultat});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { _id,  entreprise} = req.auth;
      const { id } = req.params;
      console.log(req.params)
      const { email, ...body } = req.body;
      const user = await User.findById(_id);
      if (!user) {
        res.status(401).json({
          status: false,
          message: "compte introuvable !!",
        });
      }
      const contactExist = await Contact.findOne({ _id: id });
      console.log(contactExist)
      if (!contactExist) {
        res.status(401).json({
          status: false,
          message: "contact introuvable !!",
        });
        return
      }
      const mailUsed = await Contact.findOne({ email : req.body.email})
      if(mailUsed){
        res.status(401).json({
          status:false,
          message:'adresse mail déjà utilisé !!!'
        })
        return
      }
      const numeroWhatsappUsed = await Contact.findOne({ numeroWhatsapp: req.body.numeroWhatsapp})
      if(numeroWhatsappUsed){
        res.status(401).json({
          status:false,
          message:"numero whatsapp déjà utilisé !!!"
        })
        return
      }
      const numeroSmsUsed = await Contact.findOne({ numeroSms: req.body.numeroSms})
      if(numeroSmsUsed){
        res.status(401).json({
          status:false,
          message: 'numéro sms déjà utilisé !!!'
        })
        return
      }
      await contactExist.updateOne({ email, ...body });
      res.status(200).json({
        status: true,
        message: "Contact modifié",
      });
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }
  }

  static async delete(req, res) {
    try {
      const { _id,  entreprise} = req.auth;
      const { id } = req.params;
      const { email,} = req.body;
      const isUser = await User.findOne({_id, email: req.auth.email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email: req.auth.email, entreprise, statut: 1});
      if(isUser) req.body.user = isUser._id;
      if(isAgent) req.body.agent = isAgent._id;
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      if(!isUserOrIsAgent) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
      const isEntreprise = await Entreprise.findOne({_id: entreprise, statut: 1});
      if(!isEntreprise) return res.status(203).json({message: "Vous ne faites pas partie d'aucune entreprise.", status: false});
      const isPresent = await Contact.findOne({_id: id, entreprise:isEntreprise._id, statut: 1});
      if(!isPresent) return res.status(203).json({message: "Ce contact n'existe pas.", status: false});
      const deleted = await Contact.updateOne({_id:isPresent, entreprise:isEntreprise._id, statut:1}, {statut: 0, updatedAt: Date.now()});
      if(!deleted.acknowledged || !deleted.modifiedCount) return res.status(203).json({statut: false,message: "Modification non effectué."});
      res.status(201).json({message: "Modification effectué avec succès", status: true});
    } catch (e) {
      res.status(500).json({ status: false, message: e.message,});
    }
  }

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
        if(isStructure) resultat = await Contact.find({entreprise: isStructure._id, statut: 1}).populate('entreprise').populate('user').populate('agent');
      }else{
        isStructure = await Plateforme.findOne({_id:isAdmin.plateforme._id});
        if(isStructure) resultat = await Contact.find({ statut: 1 }).populate('entreprise').populate('user').populate('agent');
      }
      if(!isStructure) return res.status(203).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
      if(!resultat.length) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      return res.status(202).json({message: "Requête traitée avec succès.", total: resultat.length, status: true, data:resultat});
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: false, message: e.message });
    }
  }

  static async getContactWhatsApp(req, res){
    try {
      const { _id, email, entreprise, plateforme } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      let structure, contact, resultat=[];
      
      if(!isUserOrIsAgent && !isAdmin) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
      if(isUserOrIsAgent){
        structure = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
        if(!structure) return res.status(203).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
        contact = await  Contact.find({entreprise:structure._id, statut:1 }).populate('entreprise').populate('user').populate('agent');
      }else{
        structure = await Plateforme.findOne({_id: isAdmin.plateforme._id});
        if(!structure) return res.status(203).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
        contact = await  Contact.find({ statut:1 }).populate('entreprise').populate('user').populate('agent');
      }

      if(!contact.length) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      contact.map(element => {
          const {fullname, numeroWhatsapp} = element;
          if(numeroWhatsapp){
            resultat.push({fullname:fullname, WhatasApp:numeroWhatsapp});
          }
      })

      if(!resultat.length) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", total:resultat.length, status: true, data: resultat});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }


  static async getContactSMS(req, res){
    try {
      const { _id, email, entreprise, plateforme } = req.auth;
      const isUser = await User.findOne({_id, email, entreprise, statut: 1});
      const isAgent = await Agent.findOne({_id, email, entreprise, statut: 1});
      const isAdmin = await Administrateur.findOne({_id, email, plateforme, statut: 1});
      const isUserOrIsAgent = isUser ? isUser : (isAgent ? isAgent : undefined);
      let structure, contact, resultat=[];
      
      if(!isUserOrIsAgent && !isAdmin) return res.status(203).json({message: "Mot de passe ou email incorrects !", status: false});
      if(isUserOrIsAgent){
        structure = await Entreprise.findOne({_id: isUserOrIsAgent.entreprise._id, statut: 1});
        if(!structure) return res.status(203).json({message: "Vous ne faites pas partie d'uncune entreprise.", status: false});
        contact = await  Contact.find({entreprise:structure._id, statut:1 }).populate('entreprise').populate('user').populate('agent');
      }else{
        structure = await Plateforme.findOne({_id: isAdmin.plateforme._id});
        if(!structure) return res.status(203).json({message: "Vous ne faites pas partie d'aucune structure.", status: false});
        contact = await  Contact.find({ statut:1 }).populate('entreprise').populate('user').populate('agent');
      }

      if(!contact.length) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      contact.map(element => {
          const {fullname, numeroSms} = element;
          if(numeroSms){
            resultat.push({fullname:fullname, smsNumber:numeroSms});
          }
      })

      if(!resultat.length) return res.status(203).json({message: "Aucun contact trouvé.", status: false});
      res.status(202).json({message: "Requête effectuée avec succès.", total:resultat.length, status: true, data: resultat});
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

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
