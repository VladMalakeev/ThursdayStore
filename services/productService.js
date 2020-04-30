const db = require('../db/index');
const languageService = require('../services/languageService');
const stringsService = require('./stringService');
const subCategoryService = require('./subCategoryService');
const subCategoryModel = require('../db/models/subCategories');
const imageService = require('./imagesService');
const productModel = require('../db/models/products');
const productsImagesModel = require('../db/models/produscts_images');
const constants = require('../utils/Constants');
const functions = require('../utils/functions');

const addProduct = async (body, files) => {
    return db.transaction()
        .then(async transaction => {
            if (!body.name) throw functions.badRequest('Name is required');
            if (!body.description) throw functions.badRequest('Description is required');

            if (!await subCategoryService.isExistSubCategory(body.catId)) {
                throw functions.badRequest('Wrong catId parameter or category not exist');
            }

            return productModel.create({categoryId: body.catId}, {transaction})
                .then(async product => {
                    let name = await stringsService.addString(body.name, transaction);
                    let description = await stringsService.addString(body.description, transaction);
                    product.setName(name, {transaction});
                    product.setDescription(description, {transaction});

                    if (files.length > 0) {
                        let gallery = await imageService.addGallery(files, transaction);
                        let galleryObj = gallery.map(image => {
                            return {productId: product.id, imageId: image.id}
                        });
                        await productsImagesModel.bulkCreate(galleryObj, {transaction});
                    }

                    transaction.commit();
                    return getProduct(product.id, null, 'eng', true);
                })
                .catch(error => {
                    transaction.rollback();
                    throw error
                })
        })
        .catch(error => {
            throw error
        })
};

const getProduct = async (id, catId, lang = constants.DefaultLanguage, admin) => {
    if (!await languageService.checkLanguageByKey(lang)) throw functions.badRequest('Wrong language key');
    if (id) {
        if (!parseInt(id)) throw functions.badRequest('Invalid id');
        let product = await productModel.findByPk(id, {
            include: [
                {association: 'name', attributes: {exclude: ['id']}},
                {association: 'description', attributes: {exclude: ['id']}},
                {association: 'images'}
            ]
        });
        if (!product) throw functions.badRequest('Product not exist');
        return {
            id: product.id,
            name: admin ? product.name : product.name[lang],
            description: admin ? product.description : product.description[lang],
            images: product.images.map(image => image.name)
        }


    } else if (catId) {
        if (!parseInt(catId)) throw functions.badRequest('Invalid category id');
        if (!await subCategoryService.isExistSubCategory(catId)) throw functions.badRequest('Category not exist');
        return productModel.findAll({
            where: {categoryId: catId},
            include: [
                {association: 'name', attributes: {exclude: ['id']}},
                {association: 'description', attributes: {exclude: ['id']}},
                {association: 'images'}
            ]
        })
            .then(products => {
                return products.map(product => {
                    return {
                        id: product.id,
                        name: admin ? product.name : product.name[lang],
                        description: admin ? product.description : product.description[lang],
                        images: product.images.map(image => image.name)
                    }
                })
            })
            .catch(error => {
                console.log(error);
                throw error;
            })

    } else throw functions.badRequest('Need specify id or catId');
};

const editProduct = async (body, files) => {
    return db.transaction()
        .then(transaction => {
            return productModel.findOne({where: {id: body.id}})
                .then(async product => {
                    if (!product) throw functions.badRequest('Wrong product id');
                    if (body.name) {
                        await stringsService.editString(body.name, product.nameId, transaction);
                    }

                    if (body.description) {
                        await stringsService.editString(body.description, product.descriptionId, transaction);
                    }

                    if (body.catId) {
                        if (!parseInt(body.catId)) {
                            throw functions.badRequest('Invalid category id');
                        }
                        if (!await subCategoryService.isExistSubCategory(body.catId)) {
                            throw functions.badRequest('Wrong catId parameter or category not exist');
                        }
                        await product.update({categoryId: body.catId}, {transaction})
                    }

                    if (body.removeImages) {
                        let images = await imageService.deleteGallery(body.removeImages,'products', transaction);
                        await productsImagesModel.destroy({where: {imageId: images.map(image => image.id)}, transaction});
                    }

                    if (files.length > 0) {
                        let allImages = await productsImagesModel.findAll({where:{productId:product.id}});
                        if(allImages.length < constants.ImagesLimit){
                            let newImageCount = constants.ImagesLimit - allImages.length;
                            files = files.slice(0, newImageCount);
                            let gallery = await imageService.addGallery(files, transaction);
                            let galleryObj = gallery.map(image => {
                                return {productId: product.id, imageId: image.id}
                            });
                            await productsImagesModel.bulkCreate(galleryObj, {transaction});
                        }
                    }

                    transaction.commit();
                    return await getProduct(product.id, null, 'eng', true);

                })
                .catch(error => {
                    transaction.rollback();
                    console.log(error);
                    throw error
                })
        }).catch(error => {
            console.log(error);
            throw error
        })
};

const deleteProduct = async (id) => {
    let product = await productModel.findByPk(id, {include:[{association:'images'}]});
    if(!product) throw functions.badRequest('Wrong id');
    return db.transaction()
        .then(async transaction => {
            await stringsService.deleteString(product.nameId, transaction);
            await stringsService.deleteString(product.descriptionId, transaction);
            let imagesList = product.images.map(image => image.name);
            await imageService.deleteGallery(imagesList, 'products',transaction);
            let result = await product.destroy();
            if(result){
                transaction.commit();
            }else{
                transaction.rollback();
            }
            return result;
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
};

module.exports = {
    addProduct,
    getProduct,
    editProduct,
    deleteProduct
};
