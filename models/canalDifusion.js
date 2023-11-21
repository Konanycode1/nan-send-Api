import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


const Canaux = new Schema ({
    libelle:{
        type: String,
        required: true
    },
    email :{
        type : String,
        unique: true,
        required: true
    },
    numeroWhatsapp:{
        type: String,
        required: false
    },
    numeroSms:{
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
},
{
    timesTamps: true
})

export default model("canaux", Canaux)