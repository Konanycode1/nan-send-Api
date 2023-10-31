import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"
import { connectDB } from "./config/db.js";
import path from 'path';

import { fileURLToPath } from 'url';
import { config } from "dotenv";
import teamRouter from "./router/teams.js"
import RouterEntreprise from "./router/entreprise.js";
import routerUser from "./router/user.js";
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
app.use('/api/user',routerUser);
app.use('/api/team',teamRouter);
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




// app.use(express.static("/images"));
// app.use((req,res,next)=>{
//     // res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
//     res.setHeader('Access-Control-Allow-Origin', "*");
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// });

const port = process.env.PORT || 3000 ;
// app.listen(port, ()=>{
//     console.log(`Le serveur a bien été lancé sur le port ${port}`);
//     console.log("La base de données a été bien connectéé avec succès !")
// });

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`server lancé avec ${port}`);
        console.log("La base de données a été bien connectéé avec succès !");
        saveAdmin();
    })
})
.catch((e)=>{
    console.log(`Serveur intérrompu`);
})

