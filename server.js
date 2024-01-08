import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"
import { connectDB } from "./config/db.js";
import path from 'path';

import { fileURLToPath } from 'url';
import { config } from "dotenv";
import RouterEntreprise from "./router/entreprise.js";
import RouterUser from "./router/user.js";
import RouterContact from "./router/contact.js";
import RouterAdministrateur from "./router/administrateur.js";
import RouterPlateforme from "./router/plateforme.js";
import RouterLogin from "./router/login.js";
import RouterMessage from "./router/message.js";
import RouterStocke from "./router/stocke.js";
import RouterCategorie from "./router/categorie.js";
import RouterArticle from "./router/article.js";
import RouterAgent from "./router/agent.js";
import saveAdmin from "./laboratoire/admin.js";
import RouterValidateCode from "./router/valideCode.js";
import DeleteExpired from "./laboratoire/filterValidate.js";
import RouterGroupe from "./router/groupe.js";



const  app = express();
config({
    path:path.join(process.cwd(),'.env')
})

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());


const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/attachement", express.static(path.join(__dirname, "attachement")));
app.use("/images" ,express.static( path.join(__dirname,'images') ));
app.use("/documents" ,express.static( path.join(__dirname,'documents') ));
app.use('/attachement', express.static(path.join(__dirname, 'attachement/documents/')));
app.use('/api/user',RouterUser);

app.use('/api/entreprise',RouterEntreprise);
app.use('/api/contact',RouterContact);
app.use('/api/admin',RouterAdministrateur);
app.use('/api/plateforme', RouterPlateforme);
app.use('/api/auth', RouterLogin);

app.use('/api/message', RouterMessage);
app.use('/api/stocke', RouterStocke);
app.use('/api/categorie', RouterCategorie);
app.use('/api/article', RouterArticle);
app.use('/api/agent', RouterAgent);
app.use('/api/validate', RouterValidateCode);
app.use('/api/groupe', RouterGroupe);

const port = process.env.PORT || 3000 ;

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`server lancé avec ${port}`);
        console.log("La base de données a été bien connectéé avec succès !");
        saveAdmin();
        DeleteExpired();
    })    
})
.catch((e)=>{
    console.log(`Serveur intérrompu\n`, e.message);
    
})

