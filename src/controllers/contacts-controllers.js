import createHttpError from "http-errors";
import { getContacts, getContactById, addContact, upsertContact, deleteContact } from '../services/contact-services.js';
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseContactFilterParams from "../utils/parseContactFilterparams.js";
import { contactFiledList } from "../constants/contact-constants.js";
import parseSortParams from "../utils/parseSortParams.js";

export const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const {query} = req
  const {page, perPage} = parsePaginationParams(query)
  const {sortBy, sortOrder} =  parseSortParams(query, contactFiledList)
  const filter = { ...parseContactFilterParams(query), userId };
 const data = await getContacts({
    page,
    perPage,
    sortBy, 
    sortOrder,
    filter,
  })
    res.json({
    status: 200,
    data,
    message: "Success found contacts"
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
    const data = await addContact({ ...req.body, userId });

    res.status(201).json({
      status: 201,
      message: 'Contact successfully added!',
      data: data,
    });
};

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
  const result = await upsertContact({ _id: id, userId }, req.body);

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
  const { _id: userId } = req.user;
  const result = await deleteContact({ _id: id, userId });

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 204,
    message: "Contact successfully deleted!",
    data: result,
  });
};
