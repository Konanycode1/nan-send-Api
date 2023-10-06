import mongoose from 'mongoose';
import Entreprise from './entrepriseModel.js';



const UtilisateurSchema = mongoose.Schema(
    {
        nomPrenom:{
            type: String,
            required: true
        },
        nationalite:{
            type: String,
            required: true
        },
        photo:{
            type: String,
            required: true
        },
        entite:{
            type: String,
            required: true,
            default: 'GESTIONNAIRE'
        },
        email:{
            type: String,
            required: true
        },
        telephone:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },

        facebook:{
            type: String,
            required: false
        },
        twitter:{
            type: String,
            required: false
        },
        instagram:{
            type: String,
            required: false
        },
        linkedIn:{
            type: String,
            required: false
        },
        youtube:{
            type: String,
            required: false
        },

        statut:{
            type: Number,
            default: 1,
            required: true
        },
        etat:{
            type: Number,
            default: 1,
            required: true
        },
        // entreprise:[
        //     {type: mongoose.Schema.Types.ObjectId, ref: Entreprise}
        // ],
        
        createdAt:{
            type: Date,
            required: true,
            default: new Date()
        },
        updatedAt:{
            type: Date,
            required: true,
            default: new Date()
        }
    },
    {
        timesTamps: true
    }
);
const Utilisateur = mongoose.model('utilisateur', UtilisateurSchema);
export default Utilisateur;
