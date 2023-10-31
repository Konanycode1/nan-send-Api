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
    expireIn: { type: Number, default: (Date.now() + 10*60*1000 ) },
    code:{ type: String, required: true },
    createdAt:{ type: Date, required: true, default: Date.now() },
    updatedAt:{ type: Date, required: true, default: Date.now()}
},
{ timesTamps: true })

export default model('validateCode', ValidateCode);