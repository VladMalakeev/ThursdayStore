const stringModel = require('../db/models/strings');
const db = require('../db/index');
const enums = require('../utils/enums');

const addString = async (stringObject, transaction) => {
    let langList = Object.keys(stringObject);
    langList.forEach(lang => {
        if(!enums.languages.includes(lang))  throw 'Wrong language key.';
    });

   return stringModel.create(stringObject, {transaction});
} ;

const editString = async (stringObject, id) => {
    return  stringModel.update(stringObject, {where:{id}})
} ;

const deleteString = async (id) => {
    return stringModel.destroy({where:{id:id}});
} ;

module.exports = {
    addString,
    editString,
    deleteString
};