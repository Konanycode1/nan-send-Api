import { Router } from "express";
import EntrepriseController from "../controller/entreprise.js";
import AUTH from "../midlleware/withAuth.js";


const RouteEntreprise = Router();

RouteEntreprise.post('/create',AUTH,EntrepriseController.create)
RouteEntreprise.get('/all/',AUTH,EntrepriseController.getAll)
RouteEntreprise.get('/:id',AUTH,EntrepriseController.getById)
RouteEntreprise.post('/:raisonSociale',AUTH,EntrepriseController.getByName)
RouteEntreprise.put('/:id',AUTH,EntrepriseController.update)
RouteEntreprise.delete('/:id',AUTH,EntrepriseController.delete)


export default RouteEntreprise
