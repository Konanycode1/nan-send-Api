import {Schema, model} from "mongoose"

const Messagerie = new Schema ({
    canal:{
        type: String,
        enum : ["Whatsapp", "SMS", "email" ],
        required: true,
        default : 'email'
    },
    user:[
        {type: [Schema.Types.ObjectId], ref: "User"}
    ],
    canal:[
        {type: [Schema.Types.ObjectId], ref: "Canal"}
    ],
    entreprise:[
        {type: [Schema.Types.ObjectId], ref: "Entreprise"}
    ],
    contact:[
        {type: [Schema.Types.ObjectId], ref: "Contact"}
    ],
    numeroWhatsapp:{
        type: Number,
        required: false
    },
    numeroSms:{
        type: Number,
        required: true
    },
    subject:{
        type: String,
        required:true,
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

export default model("messagerie", Messagerie)