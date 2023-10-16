

import Entrepise from "../models/entreprise.js";
import User from "../models/user.js";

class EntrepriseController{
    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async create(req, res){
        try {
            
            const {_id, email} = req.auth // Midlleware pour l'inscription
            const user = await User.findOne({email});
            if(!user) return res.status(203).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"}); 
            const entreprise = await Entrepise.findOne({user: _id});
            if(entreprise) return res.status(201).json({message:"Cette structure est déjà occupée !"});
            req.body.user = req.auth._id;
            const newEntreprise = await Entrepise.create(req.body);
            if(!newEntreprise) return res.status(400).json({message:"Erreur survenue lors de la sauvégarde !"});
            const updateUser = await User.updateOne({_id:user._id}, {entreprise: newEntreprise._id});
            if(updateUser.acknowledged &&  updateUser.modifiedCount) {
                const recupEntreprise = await Entrepise.findOne({_id:newEntreprise._id}).populate("user")
                return res.status(200).json({message: "Entreprise create avec succès.",recupEntreprise, status: true});
            } 
            



            // User.findOne({email})
            // .then(use=>{
            //     if(!use) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
            //     Entrepise.findOne({identifiant: _id})
            //     .then(async entreprise=>{
            //         if(entreprise) return res.status(201).json({message:"Cette structure est déjà occupée !"});
            //         const newEntreprise= awaitEntrepise.create(req.body)
            //         .then(newEntreprise=>res.status(200).json(newEntreprise));
            //     })
            //     .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            // })
            // .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }


    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getAll(req, res){
        try {
            const {_id, email} = req.auth
            User.findOne({email, statut: 1})
            .then(use=>{
                if(!use) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Entrepise.findAll()
                .then(entreprise=>{
                    if(!entreprise.length) return res.status(201).json({message:"Aucune donnée n'est trouvée !"});
                    res.status(202).json({
                        status:true,
                        token: generateToken(newUser.toObject()),
                        message : "Entrprise bien crée !!"
                    })
                    req.cookie("token", generateToken(newUser.toObject()))
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getById(req, res){
        try {
            const {_id, email} = req.auth
            User.findOne({email:email, statut: 1})
            .then(use=>{
                if(!use) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Entrepise.findById(req.params.id)
                .then(entreprise=>{
                    if(!entreprise.length) return res.status(201).json({message:"Aucune donnée n'est trouvée !"});
                    res.status(200).json({ status:true, entreprise});
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getByName(req, res){
        try {
            const {raisonSociale} = req.params
            const {_id} = req.auth
            User.findOne({_id:_id, statut: 1})
            .then(use=>{
                if(!use) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Entrepise.findAll({raisonSociale: raisonSociale})
                .then(entreprise=>{
                    if(!entreprise.length) return res.status(201).json({message:"Aucune donnée n'est trouvée !"});
                    res.status(200).json({ status:true, entreprise, message:`Il y'a ${entreprise.length} élément trouvés`});
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async update(req, res){
        try {
            const {id} = req.params;
            const {_id, email} = req.auth
            User.findOne({email:email})
            .then(use=>{
                if(!use) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Entrepise.findById(id)
                .then(entreprise=>{
                    if(!entreprise.length) return res.status(201).json({message:"Les données au modifier ne sont pas présentes !"});
                    Entrepise.findByIdAndUpdate({_id:req.body.cibling, statut: 1}, req.body, {new: true})
                    .then(newEntreprise=>{
                        res.status(202).json({ status:true, newEntreprise});
                    })
                    .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async delete(req, res){
        try {
            const {id} = req.params
            const {_id, email} = req.auth
            User.findOne({email:email, statut: 1})
            .then(use=>{ 
                if(!use) return res.status(202).json({message: "Vous n'êtes pas authorisé à effectuer cette réquete"});
                Entrepise.findOne({_id:id, statut: 1})
                .then(entreprise=>{
                    if(!entreprise) return res.status(201).json({message:"Les données au modifier ne sont pas présentes !"});
                    Entrepise.findByIdAndUpdate(req.body.cibling, {statut: 0}, {new: false})
                    .then(newEntreprise=>{
                        res.status(202).json({ status:true, newEntreprise});
                    })
                    .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
                })
                .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
            })
            .catch(()=>res.status(400).json({message:"Email ou mot de passe incorrectes !"}));
        } catch (error) {
            console.log("Erreur provenant de entrepriseController.create", error);
            res.status(500).json({message: "Mot de passe ou email incorrect"});
        } 
    }
}

export default EntrepriseController;