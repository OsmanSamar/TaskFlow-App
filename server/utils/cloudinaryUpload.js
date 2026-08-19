//Helper function for uploading profile images to Cloudinary.
// It receives the image buffer from Multer, uploads the image to the
// profiles folder, and returns the Cloudinary result containing values
// such as the image URL (secure_url) and public ID (public_id).

import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
  // Return a Promise because Cloudinary's upload_stream works asynchronously
  return new Promise((resolve, reject) => {
    // Create a Cloudinary upload stream so the image buffer
    // can be uploaded directly without saving the file locally
    const stream = cloudinary.uploader.upload_stream(
      {
        // Store all user profile images in one organized Cloudinary folder
        folder: "user-management-app/profiles",

        // Tell Cloudinary that the uploaded file is an image
        resource_type: "image",
      },
      (error, result) => {
        // Reject the Promise if Cloudinary fails to upload the image
        if (error) {
          reject(error);
        } else {
          // Return Cloudinary's result when the upload succeeds.
          // This result contains the secure_url and public_id we need later.
          resolve(result);
        }
      },
    );

    // Send the image buffer into the Cloudinary upload stream
    stream.end(buffer);
  });
};



// Helper function for deleting a profile image from Cloudinary.
// It receives the image's public ID and removes the corresponding
// image from Cloudinary when the user deletes or replaces their photo.
const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      },
      (error, result) => {
        // Reject the Promise if Cloudinary fails to delete the image
        if (error) {
          reject(error);
        } else {
          // Return Cloudinary's deletion result when the operation succeeds
          resolve(result);
        }
      },
    );
  });
};
export {uploadToCloudinary, deleteFromCloudinary};