const stringModel = require('../db/models/strings');
const enums = require('../utils/enums');
const functions = require('../utils/functions');

const addString = async (string, transaction) => {
    let stringObject = {};
    try {stringObject = JSON.parse(string)}
    catch (error) {throw functions.badRequest('Wrong strings object')}

    let langList = Object.keys(stringObject);
    langList.forEach(lang => {
        if(!enums.languages.includes(lang)) throw functions.badRequest('Wrong language key');
    });

   return stringModel.create(stringObject, {transaction});
} ;

const editString = async (string, id, transaction) => {
    let stringObject = {};
    try {stringObject = JSON.parse(string)}
    catch (error) {throw functions.badRequest('Wrong strings object')}
    let langList = Object.keys(stringObject);
    langList.forEach(lang => {
        if(!enums.languages.includes(lang)) throw functions.badRequest('Wrong language key');
    });
    return stringModel.update(stringObject, {where:{id}, returning:true, transaction})
} ;

const deleteString = async (id, transaction) => {
    return stringModel.destroy({where:{id:id}},{transaction});
} ;

module.exports = {
    addString,
    editString,
    deleteString
};