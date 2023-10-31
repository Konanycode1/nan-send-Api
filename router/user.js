import {Router} from 'express';
import UserController from '../controller/user.js'
import AUTH from '../midlleware/withAuth.js';
const RouterUser = Router();

RouterUser.post('/create', UserController.create);
RouterUser.delete('/delete/:id', AUTH, UserController.delete);
RouterUser.get('/getAll', AUTH, UserController.getAll);
RouterUser.get('/getById/:id', AUTH, UserController.getById);
RouterUser.put('/update/:id', AUTH, UserController.update);
// RouterUser.get('/getByName/:name', AUTH, UserController.getByName);

export default RouterUser;
