import {Router} from 'express'
import UserController from '../controller/user.js'
import AUTH from '../midlleware/withAuth.js';
const routerUser = Router();

routerUser.post('/create' , UserController.create);
routerUser.post('/createAgent' ,AUTH, UserController.createAgent);
routerUser.post('/login' , UserController.login);
routerUser.delete('/:id' ,AUTH, UserController.deleteUser);
routerUser.get('/all' , UserController.getAllUser);
routerUser.get('/:id' ,AUTH, UserController.getUser);
routerUser.put('/:id' ,AUTH, UserController.updateUser);

export default routerUser;
