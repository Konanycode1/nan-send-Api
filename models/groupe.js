import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import Contact from "./contact.js";

const Groupe = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', /*autopopulate: true*/ },
    agent: { type: Schema.Types.ObjectId, ref: 'agent', /*autopopulate: true*/ },
    entreprise:{ type: Schema.Types.ObjectId, ref:'entreprise', /*autopopulate: true,*/ required: true },
    contact: { type: [ { type: Schema.Types.ObjectId, ref: 'contact', /*autopopulate: true*/ } ] },
    canal: { type: String, enum: ["whatsapp", "sms", "email"], default: "email" },
    statut: { type: Number, required: true, default: 1 }
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
);

Groupe.pre("find", function (next) {
    this.populate("contact");
    this.populate("user");
    this.populate("agent");
    this.populate("entreprise");
    next();
});

export default model("groupe", Groupe);
