// import mongoose from "../config/db_connect.js";
// import Utilisateur from "./utilisateur_model.js";
import {Schema,model} from 'mongoose'


const EntrepriseSchema = mongoose.Schema(
    {
        // Le nom de la l'entreprise
        raisonSociale:{
            type: String,
            required: true
        },
        // Activité principale
        domaineDActivite:{
            type: String,
            required: true
        },
        // Matricule de l'entreprise
        adresse:{
            type: String,
            required: true
        },
        // Identifiant de celui ou celle qui a créer l'entreprise
        creerPar:[
            {type: Schema.Types.ObjectId, ref: 'Utilisateur'}
        ],
        // Identifiant de celui ou celle qui a effectué la dernière modification des informations de l'entreprise
        modifierPar:[
            {type: Schema.Types.ObjectId, ref: 'Utilisateur'}
        ],
        // Type d'entreprise c'est-à-dire s'il sagit d'une SARL, SASU, SAS, SA, etc... 
        type:{
            type: String,
            required: true
        },
        // Le statut va basculer en 0 et 1 : 0 désigne que l'entreprise en supprimée sinon 1 par défaut
        statut:{
            type: Number,
            default: 1,
            required: true
        },
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
const Entreprise = model('entreprise', EntrepriseSchema);
export default Entreprise;

