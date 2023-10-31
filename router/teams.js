import { Router } from "express";
import teamController from "../controller/teams.js";
const RouterTeams = Router();

RouterTeams.post('/create', teamController.createTeam)
RouterTeams.put('/:id', teamController.editTeam)
RouterTeams.delete('/:id', teamController.deleteTeam)
RouterTeams.get('/:id', teamController.getTeam)
RouterTeams.get('/', teamController.getAllTeam)

export default RouterTeams