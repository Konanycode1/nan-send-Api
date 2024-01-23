import Administrateur from "../models/administrateur.js";
import Plateforme from "../models/plateforme.js";
import { crypt, comparer } from '../util/bcrypt.js';
import { plateformeData } from "./plateformeData.js";

const data = { fullname:"Administrateur", email:"admin@gmail.com", password:"admin", telephone:"+2250000000000", nationalite:"admin" }

const saveAdminOrPlateforme = async ()=>{
    let IsPlateforme = await Plateforme.find();
    IsPlateforme = IsPlateforme[0];

    const IsAdmin = await Administrateur.findOne({email: data.email});
    let admin;

    if(!IsPlateforme) IsPlateforme = await Plateforme.create(plateformeData);
    
    if(!IsAdmin){
        data.password = await crypt(data.password);
        admin = await Administrateur.create(data);
        await Administrateur.updateOne({plateforme: IsPlateforme._id});
    }
}

export default saveAdminOrPlateforme;