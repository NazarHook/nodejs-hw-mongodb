import fs from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";

const saveFileToCloudinary = async (filePath, options) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, options);
    await fs.unlink(filePath);
    return result;
  } catch (error) {
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};

export default saveFileToCloudinary;
