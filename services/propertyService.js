const propertyModel = require('../db/models/properties');
const parametersModel = require('../db/models/parameters');
const productModel = require('../db/models/products');
const productPropertiesParametersModel = require('../db/models/products_properties_parameters');
const propertyParametersModel = require('../db/models/properties_parameters');
const stringsService = require('./stringService');
const languageService = require('./languageService');
const parametersService = require('./parametersService');
const functions = require('../utils/functions');
const db = require('../db/index');
const constants = require('../utils/Constants');
const { Op } = require("sequelize");

const addProperties = async (properties) => {
    functions.isArray(properties);
    return db.transaction()
        .then(async transaction => {
            let propertiesResultArray = [];
            for(let property of properties) {
                if(!property.propertyName) throw functions.badRequest('property object must contain parameter - propertyName');
                let string = await stringsService.addString(property.propertyName, transaction);
                let propertyResult = await propertyModel.create({nameId:string.id}, {transaction, returning:true})
                    .then(async result =>{
                        let parameters;
                        if(property.parameters){
                            parameters = await parametersService.addParameters(result.id, property.parameters, transaction);
                        }
                        delete string.dataValues.id;
                        return {
                            propertyId:result.id,
                            propertyName:string,
                            parameters:parameters
                        }
                    }).catch(error => {
                        transaction.rollback();
                        console.log(error);
                        throw error;
                    });
                propertiesResultArray.push(propertyResult);
            }
            transaction.commit();
            return propertiesResultArray;
        })
        .catch(error => {
            console.log(error);
            throw error;
    })
};

const getProperties = async (lang = constants.DefaultLanguage, admin) => {
    if(! await languageService.checkLanguageByKey(lang)) throw functions.badRequest('Wrong language key');
    return propertyModel.findAll({include:[{association:'name'}]})
        .then(properties => {
            return properties.map(property => {
                delete property.name.dataValues.id;
                return {
                    id:property.id,
                    name: admin ? property.name :property.name[lang]
                }
            })
        })
};

const getPropertyById = async (id, lang = constants.DefaultLanguage, admin) => {
  let property = await propertyModel.findByPk(id,{include:[{association:'name',attributes:{exclude:['id']}}]});
  if(!property) throw functions.badRequest('Wrong property id');
  return {
            id:property.id,
            name:admin ? property.name : property.name[lang]
  };
};

const getManyProperties = async (propertyList) => {
    return propertyModel.findAll({where:{id:{[Op.in]:[propertyList]}}})
        .catch(error => {
            console.log(error);
            throw 'Invalid property id!';
        })
};

const editProperty = async (name, id) => {
    if(!name) throw functions.badRequest('Name is required!');
    if(!id) throw functions.badRequest('Id is required!');

    let property = await propertyModel.findByPk(id);
    if(!property) throw functions.badRequest('Wrong property id');
    let string = await stringsService.editString(name, property.nameId);

    delete string[1][0].dataValues.id;
    return {
        id:property.id,
        name:string[1][0]
    }
};

const deleteProperty = async (id) => {
    if(!id) throw functions.badRequest('Id is required!');
    let property = await propertyModel.findByPk(id);
    if(!property) throw functions.badRequest('Wrong property id');
    return stringsService.deleteString(property.nameId)
        .then(() => {
           return  property.destroy()
                .then(() => true)
                .catch(error => {throw error})
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
};

const getParameterById = async (id, lang = constants.DefaultLanguage, admin) => {
    let parameter = await parametersModel.findByPk(id,{include:[{association:'name',attributes:{exclude:['id']}}]});
    if(!parameter) throw functions.badRequest('Wrong parameter id');
    return {
        id:parameter.id,
        name:admin ? parameter.name : parameter.name[lang]
    };
};


const getFiltersBySubCategoryId = async (catId, lang) => {
    let products = await productModel.findAll({
        where: {categoryId: catId},
        include: [
            {
                model: productPropertiesParametersModel,
                include: [{
                    model: propertyParametersModel,
                    include: [
                        {model: propertyModel},
                        {model: parametersModel}
                    ]
                }]
            }
        ]
    });

    let properties = [];
    for (let product of products) {
        for (let productsPropertiesParameter of product.productsPropertiesParameters) {
            let propertyExist = false;
            for (let property of properties) {
                if (property.propertyId === productsPropertiesParameter.propertiesParameter.property.id) {
                    let parameterName = await getParameterById(productsPropertiesParameter.propertiesParameter.parameter.id, lang, false);
                    let parameterExist = false;
                    property.parameters.forEach(parameter => {
                       if(parameter.parameterId === productsPropertiesParameter.propertiesParameter.parameter.id){
                           parameterExist = true;
                       }
                    });
                    if(!parameterExist) {
                        property.parameters.push({
                            parameterId: productsPropertiesParameter.propertiesParameter.parameter.id,
                            parameterName: parameterName.name
                        });
                    }
                    propertyExist = true;
                }
            }

            if (!propertyExist) {
                let propertyName = await getPropertyById(productsPropertiesParameter.propertiesParameter.property.id, lang, false);
                let parameterName = await getParameterById(productsPropertiesParameter.propertiesParameter.parameter.id, lang, false);
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
    }
    return properties
};

module.exports = {
    addProperties,
    getProperties,
    editProperty,
    deleteProperty,
    getPropertyById,
    getManyProperties,
    getFiltersBySubCategoryId
};

