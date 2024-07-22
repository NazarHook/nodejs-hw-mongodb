import Joi from "joi";
import { typeList } from "../constants/contact-constants.js";
export const contactAddSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'any.required': 'name is required'
    }),
    phoneNumber: Joi.number().positive().min(2).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid(...typeList).required()
})
export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.number().positive().min(2),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid(...typeList)
})