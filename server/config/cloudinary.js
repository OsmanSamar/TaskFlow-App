import dotenv from "dotenv";
// To import Cloudinary SDK
import { v2 as cloudinary } from "cloudinary";

dotenv.config({
    path:"./server/.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// For test

// cloudinary.api
//   .ping()
//   .then((result) => {
//     console.log("Cloudinary connected:", result);
//   })
//   .catch((error) => {
//     console.error("Cloudinary connection failed:", error.message);
//   });

export default cloudinary;


