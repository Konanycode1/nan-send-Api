import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"
import { connectDB } from "./config/db.js";
import path from 'path'

import { fileURLToPath } from 'url';
import { config } from "dotenv";

import teamRouter from "./router/teams.js"
import RouteEntreprise from "./router/entreprise.js";
import routerUser from "./router/user.js";
import RouteContact from "./router/contact.js";
const  app = express();
config({
    path:path.join(process.cwd(),'.env')
})

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());



const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/images" ,express.static( path.join(__dirname,'images') ));
app.use('/api/user',routerUser);
app.use('/api/team',teamRouter);
app.use('/api/entreprise',RouteEntreprise);
app.use('/api/contact',RouteContact);

// app.use(express.static("/images"));
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// })


const port =3000 || process.env.PORT ;
// app.listen(port, ()=>{
//     console.log(`Le serveur a bien été lancé sur le port ${port}`);
//     console.log("La base de données a été bien connectéé avec succès !")
// });
connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`server lancé avec ${port}`)
    })
})
.catch((e)=>{
    console.log("erreur", e.message)
})
