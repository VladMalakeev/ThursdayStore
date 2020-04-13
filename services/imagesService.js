const multer = require('multer');
const uuidv4 = require('uuid/v4');

const imageModel = require('../db/models/images');

const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/categories');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}.jpg`);
    }
});

const subCategoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/subCategories');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}.jpg`);
    }
});

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/products');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}.jpg`);
    }
});

const addImage = async (name, transaction) => {
   return  imageModel.create({name},{returning:true, transaction});
};

module.exports = {
    categoryUpload: multer({storage: categoryStorage}),
    subCategoryUpload: multer({storage: subCategoryStorage}),
    productUpload: multer({storage: productStorage}),
    addImage,
};