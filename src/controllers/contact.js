import Contact from "../models/contact"
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId)
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }
    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export default { getContacts, getContactById }
