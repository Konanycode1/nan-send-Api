import {Router} from 'express';
import AUTH from '../midlleware/withAuth.js';
import GroupeController from '../controller/groupe.js';
const RouterGroupe = Router();


RouterGroupe.post('/create', AUTH, GroupeController.create);
RouterGroupe.delete('/delete/:id', AUTH, GroupeController.delete);
// RouterGroupe.get('/getAll', AUTH, GroupeController.getAll);
RouterGroupe.get('/getById/:id', AUTH, GroupeController.getById);
RouterGroupe.put('/update/:id', AUTH, GroupeController.update);
// RouterGroupe.delete('/destroy/:email', GroupeController.destroy);
// RouterGroupe.get('/getByName/:name', AUTH, GroupeController.getByName);

export default RouterGroupe;
