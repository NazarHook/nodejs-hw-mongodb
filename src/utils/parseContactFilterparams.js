import { typeList } from "../constants/contact-constants.js";

const parseBoolean = value => {
    if (typeof value !== "string") return
    if (!['false', 'true'].includes(value)) return
        return value === 'true' 
}

 const parseContactFilterParams = ({type}) => {
    const parsedType = typeList.includes(type) ? type : null
    return {
        type: parsedType
    }
 }
 export default parseContactFilterParams