import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { getContactsController, getContactByIdController, addContactController, updateContactController, patchContactController, deleteContactController } from '../controllers/contacts-controllers.js';
import isValidId from '../middlewares/isValidId.js';

const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post('/', ctrlWrapper(addContactController));  // Ensure this route is correct
contactsRouter.put('/:id', isValidId, ctrlWrapper(updateContactController));
contactsRouter.patch('/:id', isValidId, ctrlWrapper(patchContactController));
contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
