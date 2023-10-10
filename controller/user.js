const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateur = require('../models/user');



class UserController {

 // INSCRIPTION DE L'UTILISATEUR 
    static async signup(req, res) {
        try {
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new utilisateur({
                        fullname: req.body.nom,
                        email: req.body.email,
                        password: hash,
                        role: req.body.role
                    })
                    user.save()
                        .then(() => {
                            res.status(200).json({ message: 'utilisateur créer avec sucèss !' })
                        })
                        .catch(() => {
                            res.status(400).json({ message: "echec de l'enregistrement de l'utilisateur" })
                        })
                })
                .catch(err => res.status(400).json(err));
        } catch (error) {
            res.status(400).json({ message: error })
        }

    }


// CONNEXION DE L'UTILISATEUR
    static async login(req, res) {
        try {
            console.log(req.body)
            utilisateur.findOne({ email: req.body.email })

                .then(user => {
                    if (!user) {
                        return res.status(400).json({ message: 'utilisateur introuvable' })
                    }
                    bcrypt.compare(req.body.password, user.password)
                        .then(valid => {
                            console.log(valid)
                            if (!valid) {
                                return res.status(400).json({ message: 'adresse mail / mot de passe incorrect' })
                            }
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    "RANDOM_TOKEN_SECRET",
                                    { expiresIn: '24h' },
                                )
                            })
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
                nom : req.body.nom,
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

module.exports = UserController;



