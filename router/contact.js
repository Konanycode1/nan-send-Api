import express from 'express'
import ControlContact from '../controller/contact.js';
const RouteContact = express.Router();
import withAuth from '../midlleware/withAuth.js'


RouteContact.post('/create', withAuth , ControlContact.create)
RouteContact.put('/:id', withAuth , ControlContact.update)
RouteContact.delete('/:id', withAuth ,ControlContact.delete)
RouteContact.get('/:id', withAuth ,ControlContact.getContactId)
RouteContact.get('/all', withAuth ,ControlContact.getAll)

export default RouteContact;