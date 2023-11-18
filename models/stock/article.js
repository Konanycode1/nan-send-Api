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
        },
        createdAt:{
            type: Date,
            required: true,
            default: Date.now
        },
        updatedAt:{
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        timesTamps: true
    }
)

export default model('Article', Article);;