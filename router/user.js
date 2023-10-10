import {Router} from 'express'
import UserController from '../controller/user.js'
const userRouter = Router();


userRouter.post('/create' , UserController.create);
userRouter.post('/login' , UserController.login);
userRouter.delete('/delete/:id' , UserController.deleteUser);
userRouter.get('/all' , UserController.getAllUser);
userRouter.get('/:id' , UserController.getUser);
userRouter.put('/:id' , UserController.updateUser);

export default userRouter;
