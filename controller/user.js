import utilisateur from '../models/user.js';
import { generateToken } from '../util/token.js';
import { crypt, comparer } from '../util/bcrypt.js';
class UserController {

    // FUNCTION POUR CREER UN UTILISATEUR 
    static async create(req, res){
        try {
            const {email, password, ...body} = req.body
            utilisateur.findOne({email: email})
            .then(async (user)=>{
                if(user) return res.status(201).json({status:false,message: "Ce utilisatateur est déjà ajouté"});
                utilisateur.create({
                    email,
                    password: await crypt(password),
                    ...body
                })
                res.cookie("token", generateToken(newUser.toObject()))
                .then(newUser=>{
                    res.status(202).json({
                        status:true,
                        token: generateToken(newUser.toObject()),
                        message : "Compte crée Merci  !!!!"
                    })
                    
                })
                .catch(error=>res.status(400).json({status:false,message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}));
            })
            .catch(error=>res.status(400).json({status:false,message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}))
        } catch (error) {
            res.status(501).json({message: "Service momentanement interrompu, veuillez réessayer dans quelques instants !"})
        }
    }

    // FUNCTION POUR CREER UN AGENT 
    static async createAgent(req, res){
        try {
            const {email,role,password, ...body} = req.body
            // const {email, role} = req.auth 
            utilisateur.findOne({email: email})
            .then( async (user)=>{
                if(user) return res.status(201).json({status:false,message: "Ce utilisatateur est déjà ajouté"});
                utilisateur.create({
                    email,
                    password: await crypt(password),
                    role: role,
                    ...body
                })
                .then(newUser=>{
                    res.status(202).json({
                        status:true,
                        message : "Agent crée !!!!"
                    })
                })
                .catch(error=>res.status(400).json({status:false,message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}));
            })
            .catch(error=>res.status(400).json({status:false,message: "Service momentanement indisponible, veuillez réessayer dans quelques instants !"}))
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
                            console.log(valid)
                            if (!valid) {
                                return res.status(400).json({ message: 'adresse mail / mot de passe incorrect' })
                            }
                            res.status(200).json({
                                userId: user._id,
                                token: generateToken(user.toObject())
                            })
                            req.cookie("token", generateToken(newUser.toObject()))
                        })
                        .catch(err => res.status(501).json({ message: err }))
                })
                .catch(err => res.status(500).json({ message: err }))
        } catch (error) {
            res.status(400).json({ error })
        }
    }

// OBTENIR TOUT LES UTILISATEUR
    static async getAllUser ( req , res ){
        utilisateur.find()
        .then(reponse => {
            res.status(200).json({
                reponse
            })
        })
        .catch(err => {res.status(400).json({message : err})})
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
