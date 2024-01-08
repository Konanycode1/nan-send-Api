
import { Schema, model}  from 'mongoose';
import User from './user.js';
import mongooseAutoPopulate from "mongoose-autopopulate";

const EntrepriseSchema = new Schema(
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
        user:{type: Schema.Types.ObjectId, ref: "user"},
        // Type d'entreprise c'est-à-dire s'il sagit d'une SARL, SASU, SAS, SA, etc... 
        type:{
            type: String,
            required: true
        },
        emailInfo:{
            type: String
        },
        passwordEmailInfo:{
            type: String,
        },
        // Le statut va basculer en 0 et 1 : 0 désigne que l'entreprise en supprimée sinon 1 par défaut
        statut:{
            type: Number,
            default: 1,
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                // Transformation personnalisée du document JSON
                ret.id = ret._id; // Remplace le champ "_id" par "id"
                delete ret._id; // Supprime le champ "_id"
                delete ret.__v; // Supprime le champ "__v"
              },
        },
    }
);
const Entreprise = model('entreprise', EntrepriseSchema);
export default Entreprise;
