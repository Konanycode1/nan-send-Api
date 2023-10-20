import { Schema, model } from "mongoose";

const Agent = new Schema({
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
  parain: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  entreprise: {
    type: Schema.Types.ObjectId,
    ref: "entreprise",
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["manager", "agent"],
    default: "manager",
  },
});

export default model("Agent", Agent);
