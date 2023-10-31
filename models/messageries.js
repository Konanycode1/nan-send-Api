import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


const Messagerie = new Schema ({
    canal:{
        type: String,
        enum : ["Whatsapp", "SMS", "email" ],
        required: true,
        default : 'email'
    },
    user:{type: Schema.Types.ObjectId, ref: "User", autopopulate: true},
    canal:{type: Schema.Types.ObjectId, ref: "canal", autopopulate: true},
    entreprise:{type: Schema.Types.ObjectId, ref: "entreprise", autopopulate: true},
    contact:{type: Schema.Types.ObjectId, ref: "contact", autopopulate: true},
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
},
{
    timesTamps: true
})

export default model("messagerie", Messagerie.plugin(mongooseAutoPopulate))