import express from 'express';
import withAuth from '../midlleware/withAuth.js';
import StockeController from "../controller/stocke.js";

const RouterStocke = express.Router();
RouterStocke.post("/create", withAuth, StockeController.create);
RouterStocke.get("/getAll", withAuth, StockeController.getAll);
RouterStocke.get("/getById/:id", withAuth, StockeController.getById);
RouterStocke.get("/getByReference/:reference", withAuth, StockeController.getByReference);
RouterStocke.put("/update/:id", withAuth, StockeController.update);
RouterStocke.delete("/delete/:id", withAuth, StockeController.delete);

export default RouterStocke;