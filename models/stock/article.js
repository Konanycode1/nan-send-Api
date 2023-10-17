const mongoose = require('mongoose');
const Admin = require('./modelAdmin');
const Stocke = require('./modelStocke');
const Categorie = require('./modelCategorie');
// On définit le schema de model
const articleSchema = mongoose.Schema(
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
        stockes:[
            {type: mongoose.Schema.Types.ObjectId, ref: 'stocke'}
        ],
        categorie:[
            {type: mongoose.Schema.Types.ObjectId, ref: 'categorie'}
        ],
        admins:[
            {type: mongoose.Schema.Types.ObjectId, ref: 'entreprise'}
        ]
    },
    {
        timesTamps: true
    }
)

const Article = mongoose.model('article', articleSchema);
export default Article;