import  {Schema, model}  from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

// On définit le schema de model
const Stocke = new Schema(
    {
        reference: {
            type: String,
            required: [true, 'Veuillez définir la référence du stocke !']
        },
        libelle: {
            type: String,
            required: [true, 'Veuillez définir le libelle du stocke !']
        },
        montant: {
            type: Number,
            required: [true, 'Veuillez définir le montant du stocke !']
        },
        statut: {
            type: Number,
            required: true,
            default: 1
        },
        etat: {
            type: String,
            required:true,
            default: true
        },
        entreprise:{type: Schema.Types.ObjectId, ref: "entreprise" }
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
)

export default model('stocke', Stocke );