import { Router } from "express";
import teamController from "../controller/teams.js";
const router = Router();

router.post('/', teamController.createTeam)
router.put('/', teamController.editTeam)
router.delete('/', teamController.deleteTeam)
router.get('/:id', teamController.getTeam)
router.get('/', teamController.getAllTeam)

export default router