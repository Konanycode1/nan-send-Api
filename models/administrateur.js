import { Schema, model } from "mongoose";

const Administrateur = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  etat: {
    type: Number,
    default: 1,
    required: true,
  },
  nationalite: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default model("Administrateur", Administrateur);
