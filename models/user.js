import {Schema, model} from "mongoose";
import Entreprise from "./entreprise.js";


const User = new Schema ({
    fullname:{
        type: String,
        required: true
    },
    email :{
        type : String,
        unique: true,
        required: true
    },
    telephone:{
        type: String,
        required: true
    },
    entreprise:[
        {type: Schema.Types.ObjectId, ref: "Entreprise"}
    ],
    etat:{
        type: Number,
        default: 1,
        required: true
    },
    entreprise:{
        type: Schema.Types.ObjectId,
        ref:'entreprise'
    },
    nationalite:{
        type: String,
        required: true
    },
    password : {
        type: String,
        required : true
    },
    role: {
        type: String,
        enum : ["Proprio", "manager", "agent" ],
        default: "Proprio"
    }
})

export default model("User", User)