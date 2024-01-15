import {Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";


const Agent = new Schema ({
    fullname:{ type: String, required: true },
    email :{ type : String, unique: true, required: true },
    telephone:{ type: String, required: true },
    etat:{ type: Number, default: 1, required: true },
    nationalite:{ type: String, required: true },
    user:{ type: Schema.Types.ObjectId, ref:'user' },
    entreprise:{ type: Schema.Types.ObjectId, ref:'entreprise' },
    password : { type: String, required : true },
    role: { type: String, enum : ["manager", "agent" ], default: "manager" },
    statut: { type: Number, default: 1, required: true }
},
{
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            // Transformation personnalisée du document JSON
            ret.id = ret._id; // Remplace le champ "_id" par "id"
            delete ret._id; // Supprime le champ "_id"
            delete ret.__v; // Supprime le champ "__v"
          },
    },
}
)

// export default model("Agent", Agent.plugin(mongooseAutoPopulate));
export default model("agent", Agent);