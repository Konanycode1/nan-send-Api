import Administrateur from "../models/administrateur.js";
import Plateforme from "../models/plateforme.js";
import { crypt, comparer } from '../util/bcrypt.js';
import { plateformeData } from "./plateformeData.js";

const data = { fullname:"Administrateur", email:"devadmin@gmail.com", password:"devDJ0B0@", telephone:"+2250000000000", nationalite:"admin" }

const saveAdminOrPlateforme = async ()=>{
    let IsPlateforme = await Plateforme.find();
    IsPlateforme = IsPlateforme[0];

    const IsAdmin = await Administrateur.findOne({email: data.email});

    if(!IsPlateforme) IsPlateforme = await Plateforme.create(plateformeData);
    
    if(!IsAdmin){
        data.password = await crypt(data.password);
        const admin = await Administrateur.create(data);
        await Administrateur.updateOne({email: data.email, statut: 1},{plateforme: IsPlateforme._id});
        const newAdmin = await Administrateur.findOne({email: data.email});
    }
}

export default saveAdminOrPlateforme;