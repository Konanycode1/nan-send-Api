import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

// On définit le schema de model
const Article = new Schema(
    {
        reference: {
            type: String,
            required: [true, 'Veuillez définir la référence de l\'article !']
        },
        libelle: {
            type: String,
            required: [true, 'Veuillez définir le libelle de l\'article !']
        },
        quantite: {
            type: Number,
            required: [true, 'Veuillez définir la quantité de l\'article !']
        },
        prix_unitaire: {
            type: Number,
            required: [true, 'Veuillez définir le prix unitaire de l\'article !']
        },
        montant: {
            type: Number,
            required: [true, 'Veuillez définir le montant de l\'article !']
        },
        stockes:{type: Schema.Types.ObjectId, ref: "stocke" },
        categorie:{type: Schema.Types.ObjectId, ref: "categorie" },
        entreprise:{type: Schema.Types.ObjectId, ref: "entreprise" },
        statut: {
            type: Number,
            required: true,
            default: 1
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
)

export default model('article', Article);;