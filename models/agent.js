import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


const Agent = new Schema ({
    fullname:{ type: String, required: true },
    email :{ type : String, unique: true, required: true },
    telephone:{ type: String, required: true },
    etat:{ type: Number, default: 1, required: true },
    nationalite:{ type: String, required: true },
    user:{ type: Schema.Types.ObjectId, ref:'user', autopopulate: true },
    entreprise:{ type: Schema.Types.ObjectId, ref:'entreprise', autopopulate: true },
    password : { type: String, required : true },
    role: { type: String, enum : ["manager", "agent" ], default: "manager" },
    statut: { type: Number, default: 1, required: true },
    createdAt:{ type: Date, required: true, default: Date.now },
    updatedAt:{ type: Date, required: true, default: Date.now }
},
{
    timesTamps: true
})

export default model("Agent", Agent.plugin(mongooseAutoPopulate))