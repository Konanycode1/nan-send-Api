import mongoose from "mongoose";
import { inProduction } from "./env.js";

export const connectDB = async ()=>{
    try {
        let MONGO_URI = process.env.MONGO_URI;
        if(!MONGO_URI) throw new Error("Mongo uri introuvable!!!")
        await mongoose.connect(MONGO_URI, {
            dbName: inProduction ? "NaNSend" : "NaNSend-test",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // connectTimeoutMS: 10000,
        });
    } catch (error) {
        console.log('Veuillez vérifier vos connexion internet !');
        throw new Error(error);
    }
}