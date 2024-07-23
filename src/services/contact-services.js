import { contactFiledList } from "../constants/contact-constants.js";
import { sortOrderList } from "../constants/index.js";
import Contact from "../db/models/contact.js"
import calcPaginationData from "../utils/calcPaginationdata.js";

export const getContacts = async ({ page, perPage, sortBy = contactFiledList[0], sortOrder = sortOrderList[0], filter }) => {
    const skip = (page - 1) * perPage;
    
    let dataBaseQuery = Contact.find();

    if (filter.contactType) {
        dataBaseQuery = dataBaseQuery.where("contactType").equals(filter.contactType);
    }
    const items = await dataBaseQuery.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });
    const totalItems = await dataBaseQuery.clone().countDocuments();
    const { totalPages, hasNextPage, hasPrevPage } = calcPaginationData({ total: totalItems, perPage, page });

    return {
        items,
        totalItems,
        page,
        perPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
    };
};

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