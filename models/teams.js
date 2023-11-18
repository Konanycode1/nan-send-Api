import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


const Teams = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  contact: { type: [ { type: String, ref: "contact" } ], default: [] },
  canal: { type: String, enum: ["whatsapp", "sms", "email"], default: "email" },
  statut: { type: Number, required: true, default: 1 }
},
{
  timesTamps: true,
  createdAt:{ type: Date, required: true, default: Date.now },
  updatedAt:{ type: Date, required: true, default: Date.now} },
);

export default model("Teams", Teams );
