import  {Schema, model}  from "mongoose"
// On définit le schema de model
const stockeSchema = new Schema(
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
        admins:[
            {type: mongoose.Schema.Types.ObjectId, ref: 'entreprise'}
        ]
    },
    {
        timesTamps: true
    }
)

const Stocke = model('Stocke', stockeSchema);
export default Stocke;