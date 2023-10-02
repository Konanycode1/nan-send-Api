import { Schema, model } from "mongoose";

const Entreprise = new Schema({
    name: {
        type: String,
        required: true,
    },
    siteWeb: {
        type: String,
        required: true,
    },
    numero:{
    type : Number,
    required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    nombreEmployes: {
    type: Number,
    required: true
    }
});

export default model("Entreprise", Entreprise);
