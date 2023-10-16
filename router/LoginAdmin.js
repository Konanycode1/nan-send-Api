import { Router } from "express";
import LoginController from "../controller/loginController.js";
import verify_token from "../midlleware/withAuth.js";

const RouterLogin = Router();
RouterLogin.post("/login", LoginController.loginAdmin);

export default RouterLogin;