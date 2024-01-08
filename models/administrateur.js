import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const Administrateur = new Schema ({
    fullname:{type: String, required: true},
    email:{type: String, unique: true, required: true},
    telephone:{type: String, required: true},
    etat:{type: Number, default: 1, required: true},
    nationalite:{type: String, required: true},
    password:{type: String, required : true},
    statut:{type: Number, required: true, default: 1},
    plateforme:{type: Schema.Types.ObjectId, ref: "plateforme"}
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

export default model("administrateur", Administrateur)