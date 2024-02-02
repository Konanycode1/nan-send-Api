import Administrateur from "../models/administrateur.js";
import Plateforme from "../models/plateforme.js";
import { crypt, comparer } from '../util/bcrypt.js';
import { plateformeData } from "./plateformeData.js";

const data = { fullname:"Administrateur", email:"admins1@gmail.com", password:"devDJ0B0@", telephone:"+2250000000000", nationalite:"admin" }

const saveAdminOrPlateforme = async ()=>{
    let IsPlateforme = await Plateforme.find();
    IsPlateforme = IsPlateforme[0];

    const IsAdmin = await Administrateur.findOne({email: data.email});

    if(!IsPlateforme) IsPlateforme = await Plateforme.create(plateformeData);
    
    if(!IsAdmin){
        data.password = await crypt(data.password);
        const admin = await Administrateur.create(data);
        await Administrateur.updateOne({_id:admin._id}, {plateforme: IsPlateforme._id});
        const newAdmin = await Administrateur.findById(admin._id);
        console.log(newAdmin)
    }
}

export default saveAdminOrPlateforme;