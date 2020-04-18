const multer = require('multer');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const functions = require('../utils/functions');

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
   return imageModel.create({name},{returning:true, transaction});
};

const addGallery = async (files, transaction) => {
    let images = files.map(image => {return {name:image.filename}});
    return imageModel.bulkCreate(images,{returning:true, transaction});
};

const updateImage = async (id, name, path, transaction) => {
    return imageModel.findOne({where:{id}})
        .then(image => {
            if(!image) throw 'Image not updated';
            deleteImageFromFileSystem(path, image.name);
            return image.update({name}, {transaction, returning:true});
        })
        .catch(error => {
            throw error;
        })
};

const deleteImageFromFileSystem = (path, name) => {
    try {
        fs.unlinkSync(`images/${path}/${name}`);
    }catch (e) {
        console.log(e)
    }
};

const deleteImage = async (id, path, transaction) => {
    return imageModel.findOne({where:{id:id}})
        .then(image => {
            if(!image) throw 'Wrong image id';
             deleteImageFromFileSystem(path, image.name);
            return image.destroy({transaction});
        })
        .catch(error => {
            console.log(error);
            throw error;
        })

};

const deleteGallery = async (images, path, transaction) => {
    let obj = [];
    try{
        if(typeof images === 'string') {
            obj = JSON.parse(images);
        }else obj = images;
    }catch (e) {
        throw functions.badRequest('Wrong removeImages format')
    }
    let imagesList = await imageModel.findAll({where:{name:obj.map(image => image)}});
    let result = await imageModel.destroy({where:{name:obj.map(image => image)}, returning:true, transaction});
        if(result) {
            imagesList.forEach(image => {
                deleteImageFromFileSystem(path, image.name);
            });
            return imagesList;
        }
        else throw 'removeImages parameter contain invalid image name';
};

module.exports = {
    categoryUpload: multer({storage: categoryStorage}),
    subCategoryUpload: multer({storage: subCategoryStorage}),
    productUpload: multer({storage: productStorage}),
    addImage,
    deleteImage,
    updateImage,
    addGallery,
    deleteGallery
};