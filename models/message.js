import {Schema, model} from "mongoose";
const { Types } = Schema;

const Message = new Schema ({
    canal:{ type: String, enum : ["whatsapp", "sms", "email" ], required: true, default : 'email' },
    object:{ type: String, required:true },
    contenu:{ type: String, required:true },
    piecesJointes: { type: Array, required: false, default :[] },
    sendingDate:{type: Types.Mixed, require:true},

    groupe: { type: [ { type: Schema.Types.ObjectId, ref: 'groupe'  } ] },
    contact: { type: [ { type: Schema.Types.ObjectId, ref: 'contact'  } ] },
    user: { type: Schema.Types.ObjectId, ref: 'user'  },
    agent: { type: Schema.Types.ObjectId, ref: 'agent'  },
    entreprise:{ type: Schema.Types.ObjectId, ref:'entreprise', required: true },

    accuse:{ type: Boolean, default : false, required: true },
    statut:{ type: Number, default: 1, required: true }
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
);

Message.pre("find", function (next) {
    this.populate("groupe");
    this.populate("contact");
    this.populate("user");
    this.populate("agent");
    this.populate("entreprise");
    next();
});

export default model("message", Message);


