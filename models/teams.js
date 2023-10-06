import { Schema, model } from "mongoose";

const Teams = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contact: {
    type: [
      {
        type: String,
        ref: "contact",
      },
    ],
    default: [],
  },
  canal: {
    type: String,
    enum: ["Whatsapp", "SMS", "email"],
    default: "email",
  },
});

export default model("Teams", Teams);
