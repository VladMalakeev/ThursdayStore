const {DataTypes} = require('sequelize');
const stringModel = require('../db/models/strings');
const db = require('../db/index');
const queryInterface = db.getQueryInterface();

const addString = async (stringObject) => {
    return stringModel.create(stringObject, {returning: true});
} ;

const editString = async (stringObject, id) => {
    return  stringModel.update(stringObject, {where:{id}})
} ;

const deleteString = async (id) => {
    return stringModel.destroy({where:{id:id}});
} ;

const addColumn = async (name, transaction) => {
    return queryInterface.addColumn('strings', name, {type: DataTypes.STRING, unique:true}, {transaction});
};

const removeColumn = async (name, transaction) => {
    return queryInterface.removeColumn('strings', name, {transaction});
};

module.exports = {
    addColumn,
    removeColumn,
    addString,
    editString,
    deleteString
};