import express from 'express'
import ControlContact from '../controller/contact.js';
const RouteContact = express.Router();


RouteContact.post('/create', ControlContact.create)
RouteContact.put('/:id', ControlContact.update)
RouteContact.delete('/:id', ControlContact.delete)
RouteContact.get('/:id', ControlContact.getContactId)
RouteContact.get('all/', ControlContact.getAll)

export default RouteContact;