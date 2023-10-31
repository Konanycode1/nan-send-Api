import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


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
        ref: "contact", autopopulate: true
      },
    ],
    default: [],
  },
  canal: {
    type: String,
    enum: ["Whatsapp", "SMS", "email"],
    default: "email",
  },
  statut: {
    type: Number,
    required: true,
    default: 1
  },
  createdAt:{
    type: Date,
    required: true,
    default: Date.now
},
updatedAt:{
    type: Date,
    required: true,
    default: Date.now
}
},
{
    timesTamps: true
});

export default model("Teams", Teams.plugin(mongooseAutoPopulate));
