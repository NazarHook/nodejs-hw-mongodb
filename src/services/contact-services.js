import { contactFiledList } from "../constants/contact-constants.js";
import { sortOrderList } from "../constants/index.js";
import Contact from "../db/models/contact.js"

export const getContacts = async ({filter, page, perPage, sortBy = contactFiledList[0], sortOrder = sortOrderList[0]}) => {
    const skip = (page - 1) * perPage;
    const databaseQuery = Contact.find();
    if(filter.type) {
        databaseQuery.where("type").equals(filter.type);
    }
    const items = await databaseQuery.skip(skip).limit(perPage).sort({[sortBy]: sortOrder});
    const totalItems = await Movie.find().merge(databaseQuery).countDocuments();
    const {totalPages, hasNextPage, hasPrevPage} = calcPagnationData({total: totalItems, perPage, page});
    return {
        items,
        totalItems,
        page,
        perPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
    }
} 

export const getContactById = id => Contact.findById(id);

export const addContact = data => Contact.create(data)
export const upsertContact = async (filter, data, options = {})=> {
    const result = await Contact.findOneAndUpdate(filter, data, {
        new: true,
        includeResultMetadata: true,
        ...options,
    });

    if (!result || !result.value) return null;
    const isNew = Boolean(result?.lastErrorObject?.upserted);

    return {
        data: result.value,
        isNew,
    }
};
export const deleteContact = filter => Contact.findOneAndDelete(filter);