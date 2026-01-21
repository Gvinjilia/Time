const cloudinary = require("../config/cloudinary");

const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "image",
    quality: "auto",
    format: "webp",
    transformation: [
        { width: 500, height: 500, crop: "fit", gravity: "center" }
    ]
};

const imageUpload = async (folder, files) => {
    try {
        const upload = files.map((file) => cloudinary.uploader.upload(file, { ...options, folder }));

        const results = await Promise.all(upload);

        return results;
    } catch(err){
        return {
            message: 'Error happened while uploading image',
            error: err.message
        };
    };
};

const deleteImage = (publicId) => {
    try {
        const result = cloudinary.uploader.destroy(publicId);
        return result;
    } catch(err){
        return {
            message: 'Error happened while deleting image',
            error: err.message
        };
    };
};

module.exports = { imageUpload, deleteImage };