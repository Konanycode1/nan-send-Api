import express from "express";
import UtilisateurController from "../controller/user.js";

const RouteUser = express.Router();

RouteUser.post("/createUsers", UtilisateurController.create);

export default RouteUser;