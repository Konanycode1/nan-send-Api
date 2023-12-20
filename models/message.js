import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import Contact from "./contact.js";
import User from "./user.js";
import Entreprise from "./entreprise.js";
import Agent from "./agent.js";
import Administrateur from "./administrateur.js";
import Groupe from "./groupe.js";



const Message = new Schema ({
    canal:{ type: String, enum : ["whatsapp", "sms", "email" ], required: true, default : 'email' },
    object:{ type: String, required:true },
    contenu:{ type: String, required:true },
    piecesJointes: { type: Array, required: false, default :[] },

    groupe: { type: [ { type: Schema.Types.ObjectId, ref: 'groupe'  } ] },
    contact: { type: [ { type: Schema.Types.ObjectId, ref: 'contact'  } ] },
    user: { type: Schema.Types.ObjectId, ref: 'user'  },
    agent: { type: Schema.Types.ObjectId, ref: 'agent'  },
    entreprise:{ type: Schema.Types.ObjectId, ref:'entreprise', required: true },

    accuse:{ type: Boolean, default : false, required: true },
    statut:{ type: Number, default: 1, required: true },
    createdAt:{ type: Date, required: true, default: Date.now },
    updatedAt:{ type: Date, required: true, default: Date.now }
},
{
    timesTamps: true
})

export default model("message", Message)