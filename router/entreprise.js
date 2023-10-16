import { Router } from "express";
import EntrepriseController from "../controller/entreprise.js";
import verify_token from "../midlleware/withAuth.js";


const RouteEntreprise = Router();

RouteEntreprise.post('/create', verify_token, EntrepriseController.create)
RouteEntreprise.get('/getAll', verify_token, EntrepriseController.getAll)
RouteEntreprise.get('/getById/:id', verify_token, EntrepriseController.getById)
RouteEntreprise.get('/getByName/:raisonSociale', verify_token, EntrepriseController.getByName)
RouteEntreprise.put('/update/:id', verify_token, EntrepriseController.update)
RouteEntreprise.delete('/delete:id', verify_token, EntrepriseController.delete)

export default RouteEntreprise
