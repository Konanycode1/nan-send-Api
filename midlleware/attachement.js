import multer from "multer";
import path from "path";

let storage = multer.diskStorage({
    destination: (req, file, callBack)=>{
        if(file.fieldname === "image"){
            callBack(null, "attachement/images");
        }else{
            callBack(null, "attachement/documents");
        }
    },
    filename: (req, file, callBack)=>{
        const r = al => al.length == 2 ? al[1] : r;
        const alphabet = "azertyuiopqsdfghjklmwxcvbn0123456789";
        const filename = file.originalname.split(".")[0].split("").filter(lettre=>alphabet.includes(lettre.toLowerCase())).join("").toLowerCase();
        callBack(null, Date.now()+"_"+r(Math.random().toString().split('.'))+"_"+filename+path.extname(file.originalname));
    }
});
const Attachement =  multer({
    storage: storage,
    limits:{fileSize:1024*1024*10} 
});


export default Attachement;


