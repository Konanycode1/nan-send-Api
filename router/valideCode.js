import ValidateCodeController from "../controller/validateCode.js";
import express from 'express';
const RouterValidateCode = express.Router();
import AUTH from '../midlleware/withAuth.js';


RouterValidateCode.get("/getByIdAndCode/:code/:email", ValidateCodeController.getByIdAndCode);
RouterValidateCode.delete('/delete/:_id/:code/:email', ValidateCodeController.delete);
RouterValidateCode.delete('/deleteExpired/:email',  ValidateCodeController.deleteExpired);
RouterValidateCode.delete('/deleteIfExpires/:code/:email',  ValidateCodeController.deleteIfExpires)

export default RouterValidateCode;
