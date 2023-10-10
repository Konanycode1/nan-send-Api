const express = require('express')
const UserController = require('../controller/user');
const router = express.Router();


router.post('/signup' , UserController.signup);
router.post('/login' , UserController.login);
router.delete('/delete/:id' , UserController.deleteUser);
router.get('/getAllUser' , UserController.getAllUser);
router.get('/getUser/:id' , UserController.getUser);
router.post('/updateUser/:id' , UserController.updateUser);


module.exports = router;