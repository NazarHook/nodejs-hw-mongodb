import createHttpError from "http-errors";
import { getContacts, getContactById, addContact, upsertContact, deleteContact } from '../services/contact-services.js';

export const getContactsController = async (req, res) => {
  try {
    const contacts = await getContacts();
    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  try {
    const data = await addContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Contact successfully added!',
      data: data,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateContactController = async (req, res) => {
  const { id } = req.params;
  const data = await upsertContact({ _id: id }, req.body, { upsert: true });
  const status = data.isNew ? 201 : 200;
  const message = data.isNew ? "Contact successfully added!" : "Contact successfully updated!";

  res.json({
    status,
    message,
    data: data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const result = await upsertContact({ _id: id }, req.body);

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: "Contact successfully updated!",
    data: result,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;

  const result = await deleteContact({ _id: id });

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: "Contact successfully deleted!",
    data: result,
  });
};
