import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import Contact from "./contact.js";

const Groupe = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', /*autopopulate: true*/ },
    agent: { type: Schema.Types.ObjectId, ref: 'agent', /*autopopulate: true*/ },
    entreprise:{ type: Schema.Types.ObjectId, ref:'entreprise', /*autopopulate: true,*/ required: true },
    contact: { type: [ { type: Schema.Types.ObjectId, ref: Contact, /*autopopulate: true*/ } ] },
    canal: { type: String, enum: ["whatsapp", "sms", "email"], default: "email" },
    statut: { type: Number, required: true, default: 1 },
    createdAt:{ type: Date, required: true, default: Date.now },
    updatedAt:{ type: Date, required: true, default: Date.now }
},
{ timesTamps: true }
);

export default model("groupe", Groupe);
