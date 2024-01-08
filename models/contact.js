import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const Contact = new Schema ({
    fullname:{ type: String, required: true },
    email :{ type : String, required: true },
    whatsapp:{ type: String, required: false },
    sms:{ type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    agent: { type: Schema.Types.ObjectId, ref: 'agent' },
    entreprise:{ type: Schema.Types.ObjectId, ref:'entreprise', required: true },
    statut: { type: Number, default: 1, required: true }
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

export default model("contact", Contact)