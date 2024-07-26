import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { getContactsController, getContactByIdController, addContactController, updateContactController, patchContactController, deleteContactController } from '../controllers/contacts-controllers.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../utils/validateBody.js';
import { contactAddSchema, contactUpdateSchema } from '../validation/contact-shemas.js';
import authenticate from '../middlewares/authenticate.js';

const contactsRouter = express.Router();
contactsRouter.use(authenticate)
contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(addContactController));  
contactsRouter.put('/:id', isValidId,  ctrlWrapper(updateContactController));
contactsRouter.patch('/:id', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContactController));
contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
