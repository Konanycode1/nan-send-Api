import Administrateur from "../models/administrateur.js";
import Plateforme from "../models/plateforme.js";
import { crypt, comparer } from '../util/bcrypt.js';
import { generateToken } from "../util/token.js";


const data = { fullname:"Administrateur", email:"devdjobo@gmail.com", password:"admin", telephone:"+000-00-00-00-00-00", nationalite:"admin" }

const saveAdmin = async ()=>{
    const isAdmin = await Administrateur.findOne({email: data.email});
    if(!isAdmin){
        const isPlateforme = await Plateforme.find();
        let admin;
        if(!isPlateforme){
            data.password = await crypt(data.password);
            admin = await Administrateur.create(data);
        }else{
            admin = await Administrateur.updateOne({plateforme: isPlateforme._id});
        }
    }
}

export default saveAdmin;