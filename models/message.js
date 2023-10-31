import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


const Message = new Schema ({
    canal:{
        type: String,
        enum : ["Whatsapp", "SMS", "email" ],
        required: true,
        default : 'email'
    },
    contact :{
        type : Array,
        ref : "contact",
        required: true
    },
    contenu:{
        type: String,
        required:true,
    },
    piecesJointes: {
        type: Array,
        required: false,
        default :[],
    },
    Accuse:{
        type: Boolean,
        default : false,
        required: true
    },
    statut:{
        type: Number,
        default: 1,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
},
{
    timesTamps: true
})

export default model("message", Message)