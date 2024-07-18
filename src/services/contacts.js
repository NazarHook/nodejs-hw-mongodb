import express from 'express';
import Contact from '../models/contact.js';
import logger from '../logger.js';

const router = express.Router();

// GET /contacts - Отримати всі контакти
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    logger.info('Successfully found contacts');
    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts
    });
  } catch (error) {
    logger.error('Error getting contacts:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET /contacts/:contactId - Отримати контакт за ID
router.get('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      logger.warn(`Contact not found with id ${contactId}`);
      return res.status(404).json({ message: 'Contact not found' });
    }

    logger.info(`Successfully found contact with id ${contactId}`);
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact
    });
  } catch (error) {
    logger.error('Error getting contact:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
