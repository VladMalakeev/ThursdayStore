const colorModel = require('../db/models/colors');
const functions = require('../utils/functions');

const addColor = async (key, value) => {
    if(!key)throw functions.badRequest('Key is required');
    else if(key.length === 0) throw functions.badRequest('Empty key params');

    if(!value) throw functions.badRequest('Value is required');
    else if(value.length === 0) throw functions.badRequest('Empty value params');

    return colorModel.create({key, value}, {returning:true})
        .then(result => result)
        .catch(error => {
            if(error.name === 'SequelizeUniqueConstraintError'){
                throw functions.badRequest('This key already exist')
            }else throw error
        })

};

const getColors = async () => {
    return colorModel.findAll();
};

const editColor = async (id, key, value) => {
    if(!id) throw functions.badRequest('id required');
    let color = await colorModel.findByPk(id);
    if(!color) throw functions.badRequest('Wrong id');
    if(!key)throw functions.badRequest('Key is required');
    else if(key.length === 0) throw functions.badRequest('Empty key params');

    if(!value) throw functions.badRequest('Value is required');
    else if(value.length === 0) throw functions.badRequest('Empty value params');

    return color.update({key, value}, {returning: true})
        .then(result => result)
        .catch(error => {
            if(error.name === 'SequelizeUniqueConstraintError'){
                throw functions.badRequest('This key already exist')
            }else throw error
        })
};

const deleteColor = async (id) => {
    if(!id) throw functions.badRequest('id required');
    let color = await colorModel.findByPk(id);
    if(!color) throw functions.badRequest('Wrong id');
    return color.destroy();
};

module.exports = {
    addColor,
    getColors,
    editColor,
    deleteColor
};