import express from 'express'
import ControlContact from '../controller/contact.js';
const RouterContact = express.Router();
import withAuth from '../midlleware/withAuth.js'


RouterContact.post('/create', withAuth, ControlContact.create);
RouterContact.put('/update/:id', withAuth, ControlContact.update);
RouterContact.delete('/delete/:id', withAuth, ControlContact.delete);
RouterContact.get('/getById/:id', withAuth, ControlContact.getById);
RouterContact.get('/getAll', withAuth, ControlContact.getAll);
RouterContact.get('/getByEmail/:email', withAuth, ControlContact.getByEmail);
RouterContact.get('/getContactEmail', withAuth, ControlContact.getContactEmail);
RouterContact.get('/getContactSMS', withAuth, ControlContact.getContactSMS);
RouterContact.get('/getContactWhatsApp', withAuth, ControlContact.getContactWhatsApp);


export default RouterContact;