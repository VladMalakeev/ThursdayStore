const stringModel = require('../db/models/strings');
const enums = require('../utils/enums');
const functions = require('../utils/functions');

const addString = async (string, transaction) => {
    checkStringObject(string);
    return stringModel.create(string, {returning:true, transaction});
};

const editString = async (string, id, transaction) => {
    checkStringObject(string);
    return stringModel.update(string, {where: {id}, returning: true, transaction})
};

const deleteString = async (id, transaction) => {
    return stringModel.destroy({where: {id: id}}, {transaction});
};

const checkStringObject = (object) => {
    let langList = Object.keys(object);
    if (langList.length === 0) throw functions.badRequest('String object is empty');
    langList.forEach(lang => {
        if (!enums.languages.includes(lang)) throw functions.badRequest('Wrong language key');
    });
    return true;
};

module.exports = {
    addString,
    editString,
    deleteString
};