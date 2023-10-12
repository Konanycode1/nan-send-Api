import {Schema, model} from "mongoose"

const Agent = new Schema ({
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
    etat:{
        type: Number,
        default: 1,
        required: true
    },
    nationalite:{
        type: String,
        required: true
    },

    parain:{
        type: Schema.Types.ObjectId,
        ref:'user'
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

export default model("Agent", Agent)