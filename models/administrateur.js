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
    plateforme:{type: Schema.Types.ObjectId, ref: "plateforme"},
    createdAt:{type: Date, required: true, default: Date.now()},
    updatedAt:{type: Date, required: true, default: Date.now()}
},
{ timesTamps: true });

export default model("administrateur", Administrateur)