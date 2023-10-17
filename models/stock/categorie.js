import  {Schema, model}  from "mongoose"
// On définit le schema de model
const categorieSchema = new Schema(
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
        stockes:[
            {type: mongoose.Schema.Types.ObjectId, ref: 'stocke'}
        ],
        admin:[
            {type: mongoose.Schema.Types.ObjectId, ref: 'entreprise'}
        ]
    },
    {
        timesTamps: true
    }
)

const Categorie = model('categorie', categorieSchema);
export default Categorie