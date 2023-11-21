import multer from "multer";
import path from "path";
let storage = multer.diskStorage({
    destination: (req, file, callBack)=>{
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/svg" || 
        file.mimetype === "image/jpg" || file.mimetype === "image/png"){
            callBack(null, "attachement/images");
        }else{
            callBack(null, "attachement/documents");
        }
    },
    filename: (req, file, callBack)=>{
        const r = al => al.length == 2 ? al[1] : r;
        callBack(null, Date.now()+r(Math.random().toString().split('.'))+path.extname(file.originalname));
    }
});

let fileFilter = (req, file, callBack)=>{
    if(file.fieldname === "image"){
        (file.mimetype === "image/jpeg" || file.mimetype === "image/png") ? callBack(null, true) : callBack(null, false);
    }else if(file.fieldname === "document"){
        (file.mimetype === "application/msword" || file.mimetype === "application/pdf") ? callBack(null, true) : callBack(null, false);
    }
}

// const uploaded = multer({ storage: storage, fileFilter: fileFilter }).fields([{name: "pieceJoints"}]);
const uploaded = multer({ storage, fileFilter });

export default uploaded;