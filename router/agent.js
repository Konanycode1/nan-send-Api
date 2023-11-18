import {Router} from 'express';
import AUTH from '../midlleware/withAuth.js';
import AgentController from '../controller/agent.js';
const RouterAgent = Router();

RouterAgent.post('/create' , AUTH, AgentController.create);
RouterAgent.delete('/delete/:id', AUTH, AgentController.delete);
RouterAgent.get('/getAll', AUTH, AgentController.getAll);
RouterAgent.get('/getById/:id', AUTH, AgentController.getById);
RouterAgent.put('/update/:id', AUTH, AgentController.update);
RouterAgent.get('/getByName/:name', AUTH, AgentController.getByName);

export default RouterAgent;
