import express from 'express'
import ControlContact from '../controller/contact.js';
const RouteContact = express.Router();


RouteContact.post('/contact/', ControlContact.create)
RouteContact.put('/contact/:id', ControlContact.update)
RouteContact.delete('/contact/:id', ControlContact.delete)
RouteContact.get('/contact/', ControlContact.getContactId)
RouteContact.get('/contactAll/', ControlContact.getAll)


export default RouteContact;