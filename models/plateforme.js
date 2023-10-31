import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


const Plateforme = new Schema(
    {
        // Le nom de la l'entreprise
        raisonSociale:{ type: String, required: true },
        // Activité principale
        logo:{ type: String, required: false },
        // Identifiant de celui ou celle qui a créer l'entreprise
        creerPar:{type: Schema.Types.ObjectId, ref: "user", autopopulate: true},
        // Identifiant de celui ou celle qui a effectué la dernière modification des informations de l'entreprise
        modifierPar:{type: Schema.Types.ObjectId, ref: "user", autopopulate: true},
        // Type d'entreprise c'est-à-dire s'il sagit d'une SARL, SASU, SAS, SA, etc...
        emailNormal:{ type: String, required: true },
        passwordEmailNormal:{ type: String, required: true }, 
        emailInfo:{ type: String, required: true },
        passwordEmailInfo:{ type: String, required: true },
        telephone1:{ type: String, required: true },
        telephone2:{ type: String, required: true },
        // Le statut va basculer en 0 et 1 : 0 désigne que l'entreprise en supprimée sinon 1 par défaut
        createdAt:{ type: Date, required: true, default: Date.now },
        updatedAt:{ type: Date, required: true, default: Date.now }
    },
    {
        timesTamps: true
    }
);

export default model('plateforme', Plateforme.plugin(mongooseAutoPopulate));;

