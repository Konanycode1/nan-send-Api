import { Router } from "express";
import LoginController from "../controller/login.js";
import verify_token from "../midlleware/withAuth.js";

const RouterLogin = Router();
RouterLogin.post("/login", LoginController.login);

export default RouterLogin;