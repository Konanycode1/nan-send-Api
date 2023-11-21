import express from 'express';
import withAuth from '../midlleware/withAuth.js';
import articleController from '../controller/article.js';


const RouterArticle = express.Router();
RouterArticle.post("/create", withAuth, articleController.create);
RouterArticle.get("/getAll", withAuth, articleController.getAll);
RouterArticle.get("/getById/:id", withAuth, articleController.getById);
RouterArticle.get("/getByReference/:reference", withAuth, articleController.getByReference);
RouterArticle.put("/update/:id", withAuth, articleController.update);
RouterArticle.delete("/delete/:id", withAuth, articleController.delete);

export default RouterArticle;