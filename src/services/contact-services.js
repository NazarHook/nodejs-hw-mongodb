import { contactFiledList } from "../constants/contact-constants.js";
import { sortOrderList } from "../constants/index.js";
import Contact from "../db/models/contact.js";
import calcPaginationData from "../utils/calcPaginationdata.js";

export const getContacts = async ({ page, perPage, sortBy = contactFiledList[0], sortOrder = sortOrderList[0], filter }) => {
    const skip = (page - 1) * perPage;
    
    let query = Contact.find();
    if(filter.userId) {
        query.where("userId").equals(filter.userId);
    }
    if (filter.contactType) {
        query = query.where("contactType").equals(filter.contactType);
    }
    const items = await query.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });
    const totalItems = await Contact.find().clone().countDocuments();
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

export const getContactById = id => Contact.findOne(id);

export const addContact = data => Contact.create(data);

export const upsertContact = async (filter, data, options = {}) => {
    const result = await Contact.findOneAndUpdate(filter, data, {
        new: true,
        includeResultMetadata: true,
        ...options,
    });

    if (!result) return null;

    const isNew = Boolean(result?.lastErrorObject?.upserted);

    return {
        data: result,
        isNew,
    };
};

export const deleteContact = filter => Contact.findOneAndDelete(filter);
