import {Router} from 'express'
import UserController from '../controller/user.js'
const routerUser = Router();

routerUser.post('/create' , UserController.create);
routerUser.post('/login' , UserController.login);
routerUser.delete('/delete/:id' , UserController.deleteUser);
routerUser.get('/all' , UserController.getAllUser);
routerUser.get('/:id' , UserController.getUser);
routerUser.put('/:id' , UserController.updateUser);

export default routerUser;