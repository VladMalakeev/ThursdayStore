const db = require('../db/index');
const languageService = require('../services/languageService');
const stringsService = require('./stringService');
const parametersService = require('./parametersService');
const propertyService = require('./propertyService');
const subCategoryService = require('./subCategoryService');
const imageService = require('./imagesService');
const productModel = require('../db/models/products');
const propertiesModel = require('../db/models/properties');
const parametersModel = require('../db/models/parameters');
const productPropertiesParametersModel = require('../db/models/products_properties_parameters');
const propertyParametersModel = require('../db/models/properties_parameters');
const productsImagesModel = require('../db/models/produscts_images');
const constants = require('../utils/Constants');
const currencyService = require('../services/currencyService');
const functions = require('../utils/functions');
const {Op} = require('sequelize');



const addProduct = async (body, files) => {
    return db.transaction()
        .then(async transaction => {
            if (!body.name) throw functions.badRequest('Name is required');
            if (!body.description) throw functions.badRequest('Description is required');

            let name = functions.parseString(body.name, 'name');
            let description = functions.parseString(body.description, 'description');

            let price = await currencyService.addCurrency(body.price, transaction);
            if (!await subCategoryService.isExistSubCategory(body.catId)) {
                throw functions.badRequest('Wrong catId parameter or category not exist');
            }

            return productModel.create({categoryId: body.catId, priceId: price.id}, {transaction})
                .then(async product => {
                    let newName = await stringsService.addString(name, transaction);
                    let newDescription = await stringsService.addString(description, transaction);
                    await product.setName(newName, {transaction});
                    await product.setDescription(newDescription, {transaction});

                    if (files.length > 0) {
                        let gallery = await imageService.addGallery(files, transaction);
                        let galleryObj = gallery.map(image => {
                            return {productId: product.id, imageId: image.id}
                        });
                        await productsImagesModel.bulkCreate(galleryObj, {transaction});
                    }

                    await transaction.commit();

                    return getProduct(product.id, null, constants.DefaultLanguage, constants.DefaultCurrency, true);
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

const setPropertiesForProduct = async (properties, productId) => {
    let product = await productModel.findByPk(productId);
    if (!product) throw functions.badRequest('Wrong product id!');

    if (!properties) throw functions.badRequest('Properties is required!');

    return db.transaction()
        .then(async transaction => {
            try {
                if(! await propertyService.checkIsBelongsPropertiesToCategory(product.categoryId, properties.map(property => property.propertyId))) {
                    throw functions.badRequest('One or more subcategory id of properties did not match with subcategory id of the product!');
                }
                for (let property of properties) {
                    let parameters = await parametersService.checkIsParameterBelongsToProperties(property);
                    if (parameters.length !== property.parameters.length) throw functions.badRequest('One or more parameters does not belong to the property!');
                    if(await checkExistsParametersOnProduct(parameters, productId)) throw functions.badRequest('One or more parameters already attached to the product!')

                    let propertyParametersArray = property.parameters.map(parameter => {
                        return {propertyId: property.propertyId, parameterId: parameter}
                    });
                    let propertyParametersResult = await propertyParametersModel.bulkCreate(propertyParametersArray, {
                        transaction,
                        returning: true
                    });

                    let productPropertyParameters = propertyParametersResult.map(propertyParameter => {
                        return {productId: product.id, propertiesParameterId: propertyParameter.id}
                    });
                    await productPropertiesParametersModel.bulkCreate(productPropertyParameters, {
                        transaction,
                        returning: true
                    });
                }
                transaction.commit();
                return true;
            } catch (error) {
                transaction.rollback();
                throw error;
            }
        })
};

const getProduct = async (id, catId, lang = constants.DefaultLanguage, currency = constants.DefaultCurrency, admin) => {
    if (!await languageService.checkLanguageByKey(lang)) throw functions.badRequest('Wrong language key');
    await  currencyService.checkCurrency(currency);

    if (id) {
        if (!parseInt(id)) throw functions.badRequest('Invalid id');
        let product = await productModel.findByPk(id, {
            include: [
                {association: 'name', attributes: {exclude: ['id']}},
                {association: 'description', attributes: {exclude: ['id']}},
                {association:'price',attributes: {exclude: ['id']}},
                {association: 'images'},
                {
                    model: productPropertiesParametersModel,
                    include: [{
                        model: propertyParametersModel,
                        include: [
                            {model: propertiesModel},
                            {model: parametersModel}
                        ]
                    }]
                }
            ]
        });
        if (!product) throw functions.badRequest('Product not exist');
        let properties = [];

        for (let productsPropertiesParameter of product.productsPropertiesParameters) {
            let propertyExist = false;
            for (let property of properties) {
                if (property.propertyId === productsPropertiesParameter.propertiesParameter.property.id) {
                    let parameterName = await parametersService.getParameterById(productsPropertiesParameter.propertiesParameter.parameter.id, lang, admin);
                    property.parameters.push({
                        parameterId: productsPropertiesParameter.propertiesParameter.parameter.id,
                        parameterName: parameterName.name
                    });
                    propertyExist = true;
                }
            }

            if (!propertyExist) {
                let propertyName = await propertyService.getPropertyById(productsPropertiesParameter.propertiesParameter.property.id, lang, admin);
                let parameterName = await parametersService.getParameterById(productsPropertiesParameter.propertiesParameter.parameter.id, lang, admin);
                properties.push({
                    propertyId: productsPropertiesParameter.propertiesParameter.property.id,
                    propertyName: propertyName.name,
                    parameters: [{
                        parameterId: productsPropertiesParameter.propertiesParameter.parameter.id,
                        parameterName: parameterName.name
                    }]
                })
            }
        }
        return {
            id: product.id,
            name: admin ? product.name : functions.checkIsExistString(product.name, lang),
            description: admin ? product.description : functions.checkIsExistString(product.description, lang),
            images: product.images.map(image => image.name),
            price:admin ? product.price: functions.checkIsExistPrice(product.price,currency),
            properties: properties
        }


    } else if (catId) {
        if (!parseInt(catId)) throw functions.badRequest('Invalid category id');
        if (!await subCategoryService.isExistSubCategory(catId)) throw functions.badRequest('Category not exist');
        return productModel.findAll({
            where: {categoryId: catId},
            include: [
                {association: 'name', attributes: {exclude: ['id']}},
                {association: 'description', attributes: {exclude: ['id']}},
                {association:'price',attributes: {exclude: ['id']}},
                {association: 'images'}
            ]
        })
            .then(products => {
                return products.map(product => {
                    return {
                        id: product.id,
                        name: admin ? product.name : functions.checkIsExistString(product.name, lang),
                        description: admin ? product.description : functions.checkIsExistString(product.description, lang),
                        images: product.images.map(image => image.name),
                        price:admin ? product.price: functions.checkIsExistPrice(product.price,currency),
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
                    let updateObj = {};
                    if (!product) throw functions.badRequest('Wrong product id');
                    if (body.name) {
                        let name = functions.parseString(body.name, 'name');
                        await stringsService.editString(name, product.nameId, transaction);
                    }

                    if (body.description) {
                        let description = functions.parseString(body.description, 'description');
                        await stringsService.editString(description, product.descriptionId, transaction);
                    }

                    if (body.catId) {
                        if (!parseInt(body.catId)) {
                            throw functions.badRequest('Invalid category id');
                        }
                        if (!await subCategoryService.isExistSubCategory(body.catId)) {
                            throw functions.badRequest('Wrong catId parameter or category not exist');
                        }
                        updateObj.categoryId = body.catId;
                    }

                    if (body.price) {
                        let price = await currencyService.editCurrency(body.price,product.priceId, transaction);
                        updateObj.priceId = price.id;
                    }

                    if (body.removeImages) {
                        let removeImages = functions.parseString(body.removeImages, 'removeImages');
                        let images = await imageService.deleteGallery(removeImages, 'products', transaction);
                        await productsImagesModel.destroy({
                            where: {imageId: images.map(image => image.id)},
                            transaction
                        });
                    }

                    if (files.length > 0) {
                        let allImages = await productsImagesModel.findAll({where: {productId: product.id}});
                        if (allImages.length < constants.ImagesLimit) {
                            let newImageCount = constants.ImagesLimit - allImages.length;
                            files = files.slice(0, newImageCount);
                            let gallery = await imageService.addGallery(files, transaction);
                            let galleryObj = gallery.map(image => {
                                return {productId: product.id, imageId: image.id}
                            });
                            await productsImagesModel.bulkCreate(galleryObj, {transaction});
                        }
                    }
                    await product.update(updateObj, {transaction});
                    transaction.commit();
                    return await getProduct(product.id, null, constants.DefaultLanguage, constants.DefaultCurrency, true);

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
    let product = await productModel.findByPk(id, {include: [{association: 'images'}]});
    if (!product) throw functions.badRequest('Wrong id');
    return db.transaction()
        .then(async transaction => {
            await stringsService.deleteString(product.nameId, transaction);
            await stringsService.deleteString(product.descriptionId, transaction);
            await currencyService.deleteCurrency(product.priceId, transaction);
            let imagesList = product.images.map(image => image.name);
            await imageService.deleteGallery(imagesList, 'products', transaction);
            let result = await product.destroy();
            if (result) {
                transaction.commit();
            } else {
                transaction.rollback();
            }
            return result;
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
};

const applyFilter = async (catId, filters, prices, currency = constants.DefaultCurrency, lang = constants.DefaultLanguage) => {
    if(!catId) throw functions.badRequest('CatId is required!');

    let where = {categoryId: catId};
    let propertiesArray = [];
    let parametersArray = [];
    let priceWhere = {};
    if(prices){
        let min = parseFloat(prices.min);
        let max = parseFloat(prices.max);
        if(min && max){
            priceWhere[currency] = {[Op.between]:[min,max]}
        }else throw functions.badRequest('Invalid price format');
    }

    let productInclude =  [
        {association: 'name', attributes: {exclude: ['id']}},
        {association: 'description', attributes: {exclude: ['id']}},
        {association: 'images'},
        {association:'price',attributes: {exclude: ['id']}, where:priceWhere},
    ];


    if(filters) {
        filters.forEach(property => {
            propertiesArray.push(property.propertyId);
            parametersArray = parametersArray.concat(property.parameters);
        });
    }


    if(parametersArray.length !== 0){
        productInclude.push( {
           model: productPropertiesParametersModel,
           where:{productId:{[Op.not]:null}},
           include: [{
               model: propertyParametersModel
           }]
       })
    }

    return productModel.findAll({where: where, include:productInclude})
        .then(products => {
            let result = [];
            const getProductObj = (product) => {
               return {
                   id: product.id,
                   name: product.name ? product.name[lang] : null,
                   description: product.description ? product.description[lang] : null,
                   images: product.images ? product.images.map(image => image.name) : null,
                   price: functions.checkIsExistPrice(product.price, currency)
               }
           };

            if(filters) {
                label: for (let i = 0; i < products.length; i++) {
                    if (parametersArray.length > 0) {
                        if (propertiesArray.length === 1) {
                            let counter = 0;
                            products[i].productsPropertiesParameters.forEach(productsPropertiesParameter => {
                                if (parametersArray.includes(productsPropertiesParameter.propertiesParameter.parameterId)) {
                                    counter++;
                                }
                            });
                            if (counter) {
                                result.push(getProductObj(products[i]));
                            }
                        } else {
                            let productParametersList = products[i].productsPropertiesParameters.map(elem => elem.propertiesParameter.parameterId);
                            for (let j = 0; j < filters.length; j++) {
                                let counter = 0;
                                filters[j].parameters.forEach(parameter => {
                                    if (productParametersList.includes(parameter)) counter++;
                                });
                                if (filters[j].parameters.length > 0 && !counter) continue label;
                            }
                            result.push(getProductObj(products[i]));
                        }

                    } else result.push(getProductObj(products[i]));
                }
            }else{
                result = products.map(product => {return getProductObj(product)})
            }
            return result;
    })
        .catch(error => {
            console.log(error);
            throw error;
        })
};

const checkExistsParametersOnProduct = async (parameters, productId) => {
    let parametersArray = [];
    parameters.forEach(parameter => {
        parametersArray.push(parameter.id);
    });

   return productModel.findOne({where:{id:productId}, include:[{
            model: productPropertiesParametersModel,
            where:{productId:{[Op.not]:null}},
            include: [{
                model: propertyParametersModel
            }]
        }]}).then(product => {
            if(!product) return false;
            else {
                let counter = 0;
                product.productsPropertiesParameters.forEach(productsPropertiesParameter => {
                    if (parametersArray.includes(productsPropertiesParameter.propertiesParameter.parameterId)) {
                        counter++;
                    }
                });
                return Boolean(counter);
            }
    })
};

module.exports = {
    addProduct,
    getProduct,
    editProduct,
    deleteProduct,
    setPropertiesForProduct,
    applyFilter
};
