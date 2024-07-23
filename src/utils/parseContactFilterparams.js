import { typeList } from "../constants/contact-constants.js";

const parseBoolean = value => {
    if (typeof value !== "string") return
    if (!['false', 'true'].includes(value)) return
        return value === 'true' 
}

 const parseContactFilterParams = ({contactType}) => {
    const parsedContactType = typeList.includes(contactType) ? contactType : null
    return {
        contactType: parsedContactType
    }
 }
 export default parseContactFilterParams