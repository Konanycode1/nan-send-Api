import { Router } from "express";
import EntrepriseController from "../controller/entreprise.js";


const RouteEntreprise = Router();

RouteEntreprise.post('/create',EntrepriseController.create)
RouteEntreprise.get('/all/',EntrepriseController.getAll)
RouteEntreprise.get('/:id',EntrepriseController.getById)
RouteEntreprise.post('/:raisonSociale',EntrepriseController.getByName)
RouteEntreprise.put('/:id',EntrepriseController.update)
RouteEntreprise.delete('/:id',EntrepriseController.delete)


export default RouteEntreprise