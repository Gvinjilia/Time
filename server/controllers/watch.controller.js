const Watch = require("../models/watch.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { imageUpload, deleteImage } = require("../utils/image");

const getWatches = catchAsync(async (req, res, next) => {
    const watches = await Watch.find();

    res.status(200).json(watches);
});

const getWatch = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const watch = await Watch.findById(id);

    if(!watch){
        return next(new AppError('Watch does not exist', 404));
    };

    res.status(200).json(watch);
});

const createWatch = catchAsync(async (req, res, next) => {
    const body = req.body;

    const images = req.files.map((file) => file.path);
    
    const result = await imageUpload('photos', images);

    const imageUrls = result.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id
    }));

    body.images = imageUrls;

    const newWatch = await Watch.create(body);

    res.status(201).json(newWatch);
});

const updateWatch = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if(req.files.length > 0){
        const images = req.files.map((file) => file.path);
        const result = await imageUpload('photos', images);

        req.body.images = result.map((img) => ({
            url: img.secure_url,
            public_id: img.public_id
        }));
    }

    const updatedWatch = await Watch.findByIdAndUpdate(id, req.body, {
        new: true // ვაბრუნებთ განახლებულ watch ობიექტს
    });

    // check if watch exists
    if(!updatedWatch){
        return next(new AppError('Watch Not found!', 404));
    };

    res.status(200).json(updatedWatch);
});

const deleteWatch = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const watch = await Watch.findByIdAndDelete(id);

    const returnedPromises = watch.images.map((img) => deleteImage(img.public_id));
    const result = await Promise.all(returnedPromises);

    if(!watch){
        return next(new AppError('Watch not found', 404));
    };

    res.status(204).send();
});

module.exports = { getWatch, getWatches, createWatch, updateWatch, deleteWatch };