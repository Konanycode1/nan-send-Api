import utilisateur from '../models/user.js';
import { generateToken } from '../util/token.js';
import { crypt, comparer } from '../util/bcrypt.js';
import agent from '../models/agent.js';

class UserController {

    // FUNCTION POUR CREER UN UTILISATEUR 
    static async create(req, res){
        try {
            
            const {email, password, ...body} = req.body
            console.log("email: ",email)
           const utili =  await utilisateur.findOne({email:email})
           console.log(utili)
           if(utili){
            res.status(400).json({status:false,message: "Utilisationn existe déjà"})
            return
           }
          const createUtil = await utilisateur.create({
            email,
            password: await crypt(password),
            ...body
            })
            if(!createUtil){
                res.status(501).json({status:false, message: "inscription echouée"})
                return
            }
            res.cookie("token", generateToken(createUtil.toObject()))
            res.status(201).json({
                status:true,
                token: generateToken(createUtil.toObject()),
                message : "Compte crée Merci  !!!!"
            })
            
    
        } catch (e) {
            res.status(501).json({message: e.message})
        }
    }

    // FUNCTION POUR CREER UN AGENT 
    static async createAgent(req, res){
        try {
            const {email,role,password, ...body} = req.body
            const {_id} = req.auth;
          
            const user = await utilisateur.findById(_id);
            console.log(user)
            if(!user){
                res.status(404)
                .json({
                    status: false,
                    message: "user introuvable"
                })
            }
            const verifAgent = await agent.findOne({email: email});
            if(verifAgent){
                res.status(401).json({status:false,message: "Ce utilisatateur est déjà ajouté"})
                return 
            }
            await agent.create({
                    email,
                    parain: user._id,
                    password: await crypt(password),
                    role: role,
                    ...body
                })
            res.status(202).json({
                        status:true,
                        message : "Agent crée !!!!"
                    })
                
        } catch (error) {
            res.status(501).json({message: "Service momentanement interrompu, veuillez réessayer dans quelques instants !"})
        }
    }

//  INSCRIPTION DE L'UTILISATEUR 
    // static async signup(req, res) {
    //     try {
    //         crypt.hash(req.body.password, 10)
    //             .then(hash => {
    //                 const user = new utilisateur({
    //                     fullname: req.body.nom,
    //                     email: req.body.email,
    //                     numero:req.body.numero,
    //                     etat:req.body.etat,
    //                     nationalite:req.body.nationalite,
    //                     password: hash,
    //                     role: req.body.role
    //                 })
    //                 user.save()
    //                     .then(() => {
    //                         res.status(200).json({ message: 'utilisateur créer avec sucèss !' })
    //                     })
    //                     .catch(() => {
    //                         res.status(400).json({ message: "echec de l'enregistrement de l'utilisateur" })
    //                     })
    //             })
    //             .catch(err => res.status(400).json(err));
    //     } catch (error) {
    //         res.status(400).json({ message: error })
    //     }
    // }


// CONNEXION DE L'UTILISATEUR
    static async login(req, res) {
        try {
            const {email, password} = req.body
            utilisateur.findOne({ email: email })
                .then( async (user) => {
                    if (!user) {
                        return res.status(400).json({ message: 'utilisateur introuvable' })
                    }
                     await comparer(password, user.password)
                        .then(valid => {
                            if (!valid) {
                                return res.status(400).json({ message: 'adresse mail / mot de passe incorrect' })
                            }
                            res.cookie("token", generateToken(user.toObject()))
                            res.status(200).json({
                                userId: user._id,
                                token: generateToken(user.toObject())
                            })
                        })
                })
                .catch(err => res.status(500).json({ message: err }))
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

// OBTENIR TOUT LES UTILISATEUR
    static async getAllUser ( req , res ){
        await utilisateur.find()
        .then(reponse => {
            res.status(200).json({
                reponse
            })
        })
        .catch(err => { return res.status(400).json({message : err})})
    }

//  OBTENIR UN UTILISATEUR UNIQUE   
    static async getUser (req , res ){
        const { id } = req.params
        await utilisateur.findOne({_id : id})
        .then(response =>{
            res.status(200).json({
                response
            })
        })
        .catch(err => {
            res.status(400).json({err})
        })
    }



// SUPPRIMER UTILISATEUR AVEC SON ID
    static async deleteUser(req , res){
        const { id } = req.params;
        try {
            const users = await utilisateur.findOne({_id : id});
            console.log("l'id de l'utilisateur :" , id)
            if(users){
                users.deleteOne({_id : id})
                res.status(200).json({status : true , message : 'utilisateur supprimé !'})
                return
            }
            res.status(400).json({message : 'utilisateur introuvable !'})
            
        } catch (error) {
            res.status(400).json({message : error});
        }
    }


// METTRE A JOUR LES INFORMATION DE L'UTILISATEUR
    static async updateUser ( req , res ){
        const { id } = req.params
        const users =  await utilisateur.findOne({_id : id});

        if(users){
            let updateData = {
                fullname: req.body.nom,
                email : req.body.email
            }
            utilisateur.findByIdAndUpdate(users  , {$set : updateData})
            .then(() =>{
                res.status(200).json({message : 'Donnée mise à jours !'})
            })
            .catch(err => res.status(400).json({err}));
        }
    }
}

export default UserController;
