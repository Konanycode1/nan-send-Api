import express from 'express';
import withAuth from '../midlleware/withAuth.js';
import CategorieController from '../controller/categorie.js';


const RouterCategorie = express.Router();
RouterCategorie.post("/create", withAuth, CategorieController.create);
RouterCategorie.get("/getAll", withAuth, CategorieController.getAll);
RouterCategorie.get("/getById/:id", withAuth, CategorieController.getById);
RouterCategorie.get("/getByReference/:reference", withAuth, CategorieController.getByReference);
RouterCategorie.put("/update/:id", withAuth, CategorieController.update);
RouterCategorie.delete("/delete/:id", withAuth, CategorieController.delete);

export default RouterCategorie;