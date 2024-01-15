import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

// On définit le schema de model
const User = new Schema(
    {
        fullname:{ type: String, required: true },
        email :{ type : String, unique: true, required: true },
        telephone:{ type: String, required: true },
        entreprise:{type: Schema.Types.ObjectId, ref: "entreprise" },
        etat:{ type: Number, default: 1, required: true },
        nationalite:{ type: String, required: true },
        password : { type: String, required : true },
        role: { type: String, default: "Proprio" },
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
            }
        }
    }
);

User.pre("save", function (next) {
    this.email = this.email.toLowerCase();
    this.telephone = this.telephone.replaceAll(' ', '');
    next();
});

export default model("user", User);
