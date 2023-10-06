import {Schema, model} from "mongoose"

const Contact = new Schema ({
    fullname:{
        type: String,
        required: true
    },
    email :{
        type : String,
        unique: true,
        required: true
    },
    numeroWhatsapp:{
        type: Number,
        required: false
    },
    numeroSms:{
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId
    }
})

export default model("Contact", Contact)