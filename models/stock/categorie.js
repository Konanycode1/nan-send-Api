import  {Schema, model}  from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


// On définit le schema de model
const Categorie = new Schema(
    {
        reference: {
            type: String,
            required: [true, 'Veuillez définir la référence de la catégorie !']
        },
        libelle: {
            type: String,
            required: [true, 'Veuillez définir le libelle de la catégorie !']
        },
        resume: {
            type: String,
            required: false
        },
        statut: {
            type: Number,
            required: true,
            default: 1
        },
        etat: {
            type: String,
            required:true,
            default: ''
        }, 
        stocke:{type: Schema.Types.ObjectId, ref: "stocke" },
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

export default model('categorie', Categorie );