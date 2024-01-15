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

export default model("canaux", Canaux)