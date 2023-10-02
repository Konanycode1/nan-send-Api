import {Schema, model} from "mongoose"

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