import  {Schema, model}  from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


// On définit le schema de model
const User = new Schema(
    {
    fullname:{ type: String, required: true },
    email :{ type : String, unique: true, required: true },
    telephone:{ type: String, required: true },
    entreprise:{type: Schema.Types.ObjectId, ref: "entreprise" },
    etat:{ type: Number, default: 1, required: true },
    nationalite:{ type: String, required: true },
    password : { type: String, required : true },
    role: { type: String, default: "Proprio" },
    statut: { type: Number, default: 1, required: true },
    createdAt:{ type: Date, required: true, default: Date.now },
    updatedAt:{ type: Date, required: true, default: Date.now}
},
{ timesTamps: true })

export default model('user', User );