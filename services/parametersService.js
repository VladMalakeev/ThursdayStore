const parametersModel = require('../db/models/parameters');
const stringService = require('../services/stringService');
const propertyModel = require('../db/models/properties');
const functions = require('../utils/functions');
const constants = require('../utils/Constants');
const languageService = require('../services/languageService');
const {Op} = require('sequelize');

const addParameters = async (propertyId, parameters, transaction) => {
    if(!propertyId) throw functions.badRequest('PropertyId is required!');
    if(!parameters) throw functions.badRequest('Parameters is required!');
    functions.isArray(parameters);
    let resultArray = [];
    for (let parameter of parameters){
        if(!parameter.parameterName) throw functions.badRequest('ParameterName is required!');
        let string = await stringService.addString(parameter.parameterName, transaction);
        let parameterObj = await parametersModel.create({nameId:string.id, propertyId}, {returning:true, transaction})
            .then(result => {
                delete string.dataValues.id;
                return {
                    parameterId:result.id,
                    parameterName:string
                }
            }).catch(error => {
                console.log(error);
                throw error;
            });
        resultArray.push(parameterObj);
    }
    return resultArray;
};

const getParameters = async (lang = constants.DefaultLanguage, propertyId, admin) => {
    if(!propertyId) throw functions.badRequest('PropertyId is required!');
    if(! await languageService.checkLanguageByKey(lang)) throw functions.badRequest('Wrong language key');

    return parametersModel.findAll({where:{propertyId}, include:[{association:'name', attributes:{exclude:['id']}}]})
        .then(parameters => {
            return parameters.map(parameter => {
                return {
                    id:parameter.id,
                    name: admin ? parameter.name :functions.checkIsExistString(parameter.name, lang),
                }
            })
        })
};

const getParameterById = async (id, lang = constants.DefaultLanguage, admin) => {
    let parameter = await parametersModel.findByPk(id,{include:[{association:'name',attributes:{exclude:['id']}}]});
    if(!parameter) throw functions.badRequest('Wrong parameter id');
    return {
        id:parameter.id,
        name:admin ? parameter.name : functions.checkIsExistString(parameter.name, lang),
    };
};

const editParameter = async (name, id, propertyId) => {
    if(!id) throw functions.badRequest('Id is required!');

    let parameter = await parametersModel.findByPk(id, {include:[{association:'name'}]});
    if(!parameter) throw functions.badRequest('Wrong parameter id');

    let updateObj = {};
    let string = parameter.name;
    if(name){
         let newName = await stringService.editString(name, parameter.nameId);
         string = newName[1][0];
    }
    if(propertyId){
        let property = await propertyModel.findByPk(propertyId);
        if(!property) throw functions.badRequest('Wrong property id');
      updateObj.propertyId = propertyId;
    }
    return parameter.update(updateObj, {returning: true})
        .then(response => {
            delete string.dataValues.id;
            return {
                id:response.id,
                propertyId:response.propertyId,
                name:string
            };
        })
        .catch(error => {
            console.log(error);
            throw error;
        })


};

const deleteParameter = async (id) => {
    if(!id) throw functions.badRequest('Id is required!');
    let parameter = await parametersModel.findByPk(id);
    if (!parameter) throw functions.badRequest('Wrong id!');
    return stringService.deleteString(parameter.nameId)
        .then(() => {
            return parameter.destroy()
                .then(() => true)
                .catch(error => {throw error})
        })
        .catch(error => {throw error})
};

const checkIsParameterBelongsToProperties = async (data) => {
   return parametersModel.findAll({where:{propertyId:data.propertyId, id:{[Op.in]:data.parameters}}})
};

module.exports = {
    addParameters,
    getParameters,
    editParameter,
    deleteParameter,
    checkIsParameterBelongsToProperties,
    getParameterById
};

