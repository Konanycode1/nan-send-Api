import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


const Plateforme = new Schema(
    {
        // Le nom de la l'entreprise
        raisonSociale:{ type: String, required: true },
        // Activité principale
        logo:{ type: String, required: false },
        // Identifiant de celui ou celle qui a créer l'entreprise
        creerPar:{type: Schema.Types.ObjectId, ref: "user" },
        // Identifiant de celui ou celle qui a effectué la dernière modification des informations de l'entreprise
        modifierPar:{type: Schema.Types.ObjectId, ref: "user" },
        // Type d'entreprise c'est-à-dire s'il sagit d'une SARL, SASU, SAS, SA, etc...
        emailNormal:{ type: String, required: true },
        passwordEmailNormal:{ type: String, required: true }, 
        emailInfo:{ type: String, required: true },
        passwordEmailInfo:{ type: String, required: true },
        telephone1:{ type: String, required: true },
        telephone2:{ type: String, required: true },
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

export default model('plateforme', Plateforme );;

