import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dqph3qip7",
  api_key: "738471934363193",
  api_secret: "MXSmuudIsZE-Tf67boUwfi8aZj8",
});

// Configure Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder in Cloudinary where the images will be stored
    public_id: (req, file) => Date.now(), // Generate unique filename
  },
});

const multerUpload = multer({ storage: storage });

export default multerUpload;
