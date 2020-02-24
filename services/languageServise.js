const languageModel = require('../db/models/languages');
const stringService = require('../services/StringServise');
const db = require('../db/index');

const addLanguage = async (nameObject) => {
    let transaction = await db.transaction();
    let language = await languageModel.create(nameObject, {returning:true, transaction});
    let column = await stringService.addColumn(nameObject.name, transaction);
    return Promise.all([language, column])
        .then(result => {
            transaction.commit();
            return result[0];
        })
        .catch(error => {
            transaction.rollback();
            throw error
        })
};

const removeLanguage = async (id) => {
    return languageModel.findByPk(id).then(async language => {
        let transaction = await db.transaction();
        let column = await stringService.removeColumn(language.name, transaction);
        let destroy = await language.destroy({transaction});
        return Promise.all([destroy, column])
            .then(result => {
                transaction.commit();
                return result[0];
            })
            .catch(error => {
                transaction.rollback();
                throw error
            })
    })
};

const getAllLanguages = async () => {
    return languageModel.findAll();
};

module.exports = {
    addLanguage,
    removeLanguage,
    getAllLanguages
};