import express from 'express'

const RouteAdministrateur = express.Router();
import withAuth from '../midlleware/withAuth.js'
import AdminController from '../controller/administrateur.js';

RouteAdministrateur.post('/create', AdminController.create)
RouteAdministrateur.put('/update/:id', withAuth , AdminController.update)
RouteAdministrateur.delete('/delete/:id', withAuth ,AdminController.delete)
RouteAdministrateur.get('/getById/:id', withAuth ,AdminController.getById)
RouteAdministrateur.get('/getAll', withAuth ,AdminController.getAll);
RouteAdministrateur.get('/getByName/:fullname', withAuth ,AdminController.getByName)

export default RouteAdministrateur;