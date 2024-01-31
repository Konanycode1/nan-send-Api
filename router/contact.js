import express from 'express'
import ControlContact from '../controller/contact.js';
const RouterContact = express.Router();
import withAuth from '../midlleware/withAuth.js';
import Attachement from '../midlleware/attachement.js';

RouterContact.post('/create', withAuth, ControlContact.create);
RouterContact.put('/update/:id', withAuth, ControlContact.update);
RouterContact.delete('/delete/:id', withAuth, ControlContact.delete);
RouterContact.put('/recover/:id' , withAuth, ControlContact.recover);
RouterContact.get('/getById/:id', withAuth, ControlContact.getById);
RouterContact.get('/getAll', withAuth, ControlContact.getAll);
<<<<<<< HEAD
RouterContact.get('/getAllDeleted' , withAuth , ControlContact.getAllDeleted);
=======
RouterContact.get('/getAllDelete', withAuth, ControlContact.getAllDelete);
>>>>>>> 3f0f4321378de0dfc0dbff883e94fcf6bb238269
RouterContact.get('/getByEmail/:email', withAuth, ControlContact.getByEmail);
RouterContact.get('/getContactEmail', withAuth, ControlContact.getContactEmail);
RouterContact.get('/getContactSMS', withAuth, ControlContact.getContactSMS);
RouterContact.get('/getContactWhatsApp', withAuth, ControlContact.getContactWhatsApp);
RouterContact.post('/saveContentFileToJson', withAuth, Attachement.single('excelOrCsv'), ControlContact.saveContentFileToJson);


export default RouterContact;