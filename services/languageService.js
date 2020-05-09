const languageModel = require('../db/models/languages');
const functions = require('../utils/functions');

const addLanguage = async (nameObject) => {
    if(!nameObject.key) throw functions.badRequest('Key is required');
    if(!nameObject.name) throw functions.badRequest('Name is required');
    return  languageModel.create(nameObject, {returning:true});
};

const removeLanguage = async (id) => {
    return languageModel.destroy({where:{id}});
};

const getAllLanguages = async () => {
    return languageModel.findAll();
};

const checkLanguageByKey = async (key) => {
    return languageModel.findOne({where:{key}});
};

module.exports = {
    addLanguage,
    removeLanguage,
    getAllLanguages,
    checkLanguageByKey
};