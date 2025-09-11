import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config({
  cloud_name: 'dx3szvgwu',
  api_key: '987628553941338',
  api_secret: 'xvQsNYsVRl07tSfkyWsrDqEQdiU'
});


const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});


export const upload = multer({ storage: postStorage });
