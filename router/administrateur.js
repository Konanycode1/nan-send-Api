import express from 'express'

const RouterAdministrateur = express.Router();
import withAuth from '../midlleware/withAuth.js'
import AdminController from '../controller/administrateur.js';

RouterAdministrateur.post('/create', AdminController.create)
RouterAdministrateur.put('/update/:id', withAuth , AdminController.update)
RouterAdministrateur.delete('/delete/:id', withAuth ,AdminController.delete)
RouterAdministrateur.get('/getById/:id', withAuth ,AdminController.getById)
RouterAdministrateur.get('/getAll', withAuth ,AdminController.getAll);
RouterAdministrateur.get('/getByName/:fullname', withAuth ,AdminController.getByName)
RouterAdministrateur.get('/entrepriseId/:id',withAuth, AdminController.getEntrepriseById)
RouterAdministrateur.get('/entrepriseName/:raisonSociale',withAuth, AdminController.getEntrepriseByName)
RouterAdministrateur.get('/entrepriseChangeStatut/:id',withAuth, AdminController.getEntrepriseChangeStatut)
RouterAdministrateur.get('/entrepriseAll/', withAuth, AdminController.getEntrepriseAll)
export default RouterAdministrateur;