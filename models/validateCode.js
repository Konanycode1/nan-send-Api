import  {Schema, model}  from "mongoose";

// On définit le schema de model
const ValidateCode = new Schema(
    {
    fullname:{ type: String, required: true },
    email :{ type : String, unique: true, required: true },
    telephone:{ type: String, required: true },
    etat:{ type: Number, default: 1, required: true },
    nationalite:{ type: String, required: true },
    password : { type: String, required : true },
    statut: { type: Number, default: 1, required: true },
    expireIn: { type: Number, default: (Date.now() + 25*60*1000 ) },
    code:{ type: String, required: true }
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

export default model('validateCode', ValidateCode);