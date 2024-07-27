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
  try {
    console.log("Request file:", req.file);
    console.log("Request body:", req.body);

    const { _id: userId } = req.user;
    const enable_cloudinary = process.env.ENABLE_CLOUDINARY === "true";
    let photo = "";

    if (req.file) {
      try {
        const tempPath = req.file.path;
        if (enable_cloudinary) {
          const cloudinaryResponse = await saveFileToCloudinary(tempPath, { folder: "photos" });
          console.log("Cloudinary response:", cloudinaryResponse);
          photo = cloudinaryResponse.secure_url;
        } else {
          const publicDir = path.join(__dirname, '../public/photos');
          const newFilePath = path.join(publicDir, req.file.filename);

          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          fs.renameSync(tempPath, newFilePath);
          photo = newFilePath;
        }
      } catch (error) {
        console.error("File upload error:", error);
        return res.status(500).json({
          status: 500,
          message: "Failed to upload file",
          data: error.message,
        });
      }
    } else {
      return res.status(400).json({
        status: 400,
        message: "Photo is required",
      });
    }

    const data = await addContact({ ...req.body, userId, photo });

    res.status(201).json({
      status: 201,
      message: "Contact successfully added!",
      data,
    });
  } catch (error) {
    console.error("Add contact error:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to add contact",
      data: error.message,
    });
  }
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