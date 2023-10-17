import { Router } from "express";
import teamController from "../controller/teams.js";
const router = Router();

router.post('/create', teamController.createTeam)
router.put('/:id', teamController.editTeam)
router.delete('/:id', teamController.deleteTeam)
router.get('/:id', teamController.getTeam)
router.get('/', teamController.getAllTeam)

export default router