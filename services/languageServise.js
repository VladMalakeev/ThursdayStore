const languageModel = require('../db/models/languages');

const addLanguage = async (nameObject) => {
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