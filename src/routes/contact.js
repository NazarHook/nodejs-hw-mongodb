import express from 'express'
const router = express.Router()
import { getContacts, getContactById } from ('../controllers/contacts')

router.get('/', getContacts)
router.get('/:contactId', getContactById)

export default router