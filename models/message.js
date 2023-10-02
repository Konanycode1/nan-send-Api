import {Schema, model} from "mongoose"

const Message = new Schema ({
    canal:{
        type: String,
        enum : ["Whatsapp", "SMS", "email" ],
        required: true,
        default : 'email'
    },
    contact :{
        type : [String],
        ref : "contact",
        default :[]
    },
    numeroWhatsapp:{
        type: Number,
        required: false
    },
    numeroSms:{
        type: Number,
        required: true
    },
    contenu:{
        type: String,
        required:true,
    },
    piecesJointes: {
        type: [String],
        required: false,
        default :[],
    },
    Accuse:{
        type: Boolean,
        enum:["false", "true"],
        default : "false"
    }
})

export default model("Message", Message)