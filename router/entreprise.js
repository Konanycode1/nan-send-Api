import { Router } from "express";
import EntrepriseController from "../controller/entreprise.js";
import verify_token from "../midlleware/withAuth.js";


const RouterEntreprise = Router();

RouterEntreprise.post('/create', verify_token, EntrepriseController.create)
RouterEntreprise.get('/getAll', verify_token, EntrepriseController.getAll)
RouterEntreprise.get('/getById/:id', verify_token, EntrepriseController.getById)
RouterEntreprise.get('/getByName/:raisonSociale', verify_token, EntrepriseController.getByName)
RouterEntreprise.put('/update/:id', verify_token, EntrepriseController.update)
RouterEntreprise.delete('/delete:id', verify_token, EntrepriseController.delete)

export default RouterEntreprise
