const propertyModel = require('../db/models/properties');
const stringsService = require('../services/stringService');
const languageService = require('../services/languageService');
const parametersService = require('../services/parametersService');
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



module.exports = {
    addProperties,
    getProperties,
    editProperty,
    deleteProperty,
    getPropertyById,
    getManyProperties
};

