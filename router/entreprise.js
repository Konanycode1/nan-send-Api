import { Router } from "express";
import EntrepriseController from "../controller/entreprise.js";
import verify_token from "../midlleware/withAuth.js";


const RouteEntreprise = Router();

RouteEntreprise.post('/create', verify_token, EntrepriseController.create)
RouteEntreprise.get('/all/', verify_token, EntrepriseController.getAll)
RouteEntreprise.get('/:id', verify_token, EntrepriseController.getById)
RouteEntreprise.post('/:raisonSociale', verify_token, EntrepriseController.getByName)
RouteEntreprise.put('/:id', verify_token, EntrepriseController.update)
RouteEntreprise.delete('/:id', verify_token, EntrepriseController.delete)

export default RouteEntreprise
