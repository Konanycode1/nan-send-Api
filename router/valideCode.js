import ValidateCodeController from "../controller/validateCode.js";
import express from 'express';
const RouterValidateCode = express.Router();

RouterValidateCode.get("/api/validate/getByIdAndCode", ValidateCodeController.getByIdAndCode)

