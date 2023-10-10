import { Schema, model}  from 'mongoose'


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
        identifiant:[
            {type: Schema.Types.ObjectId, ref: 'user'}
        ],
        // Type d'entreprise c'est-à-dire s'il sagit d'une SARL, SASU, SAS, SA, etc... 
        type:{
            type: String,
            required: true
        },
        // Le statut va basculer en 0 et 1 : 0 désigne que l'entreprise en supprimée sinon 1 par défaut
        statut:{
            type: Number,
            default: 1,
            required: true
        },
        createdAt:{
            type: Date,
            required: true,
            default: new Date()
        },
        updatedAt:{
            type: Date,
            required: true,
            default: new Date()
        }
    },
    {
        timesTamps: true
    }
);
const Entreprise = model('entreprise', EntrepriseSchema);
export default Entreprise;

