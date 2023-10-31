import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const Contact = new Schema ({
    fullname:{ type: String, required: true },
    email :{ type : String, unique: true, required: true },
    numeroWhatsapp:{ type: String, required: false },
    numeroSms:{ type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', autopopulate: true },
    agent: { type: Schema.Types.ObjectId, ref: 'agent', autopopulate: true },
    entreprise:{ type: Schema.Types.ObjectId, ref:'entreprise', autopopulate: true, required: true },
    statut: { type: Number, default: 1, required: true },
    createdAt:{ type: Date, required: true, default: Date.now },
    updatedAt:{ type: Date, required: true, default: Date.now }
},
{
    timesTamps: true
})

export default model("Contact", Contact.plugin(mongooseAutoPopulate))