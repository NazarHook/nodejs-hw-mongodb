import cloudinary from 'cloudinary';
import { promisify } from 'util';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadAsync = promisify(cloudinary.v2.uploader.upload);

const saveFileToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await uploadAsync(filePath, options);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default saveFileToCloudinary;
