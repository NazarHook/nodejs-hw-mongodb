// controllers/contacts-controllers.js

import createHttpError from "http-errors";
import { getContacts, getContactById, addContact, upsertContact, deleteContact } from '../services/contact-services.js';
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseContactFilterParams from "../utils/parseContactFilterparams.js";
import parseSortParams from "../utils/parseSortParams.js";
import saveFileToCloudinary from "../utils/saveFileToCloudinary.js";
import saveFileToPublicDir from '../utils/saveFileToPublicDir.js'
import { contactFiledList } from "../constants/contact-constants.js";
import 'dotenv/config.js'

export const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { query } = req;
  const { page, perPage } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, contactFiledList);
  const filter = { ...parseContactFilterParams(query), userId };
  const data = await getContacts({ page, perPage, sortBy, sortOrder, filter });
  res.json({
    status: 200,
    data,
    message: "Successfully found contacts",
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const contact = await getContactById({ _id: id, userId });
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
  const { _id: userId } = req.user;
  const enable_cloudinary = process.env.ENABLE_CLOUDINARY;
  let photo = "";

  if(req.file) {
    if(enable_cloudinary) {
      photo = await saveFileToCloudinary(req.file, "photos");
    } else {
      photo = await saveFileToPublicDir(req.file, "photos");
    }
  }

  const data = await addContact({ ...req.body, userId, photo });

  res.status(201).json({
    status: 201,
    message: "Success add contact",
    data,
  });
}

export const updateContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await upsertContact({ _id: id, userId }, req.body, { upsert: true });
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
  const { _id: userId } = req.user;
  const updates = req.body;
  
  if(req.file) {
    const enable_cloudinary = process.env.ENABLE_CLOUDINARY;
    if(enable_cloudinary) {
      updates.photo = await saveFileToCloudinary(req.file, "photos");
    } else {
      updates.photo = await saveFileToPublicDir(req.file, "photos");
    }
  }

  const result = await upsertContact({ _id: id, userId }, updates);

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: "Contact successfully updated!",
    data: result.data.value,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const result = await deleteContact({ _id: id, userId });

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.status(204).json({
    message: "Contact successfully deleted!",
  });
};
