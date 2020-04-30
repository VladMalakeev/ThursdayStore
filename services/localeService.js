const stringsService = require('../services/stringService');
const functions = require('../utils/functions');
const db = require('../db/index');
const localeModel = require('../db/models/locale');
const constants = require('../utils/Constants');
const languageService = require('../services/languageService');

const addLocale = async (key, value) => {
    if(!key)throw functions.badRequest('Key is required');
    else if(key.length === 0) throw functions.badRequest('Empty key params');

    if(!value) throw functions.badRequest('Value is required');

    return db.transaction()
        .then(async transaction => {
            let string = await stringsService.addString(value, transaction);
            return localeModel.create({key:key, valueId:string.id}, {returning:true, transaction})
                .then(result => {
                    transaction.commit();
                    return result;
                })
                .catch(error => {
                    transaction.rollback();
                    if(error.name === 'SequelizeUniqueConstraintError'){
                        throw functions.badRequest('This key already exist')
                    }else throw error;
                })
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
};

const getLocale = async (lang = constants.DefaultLanguage, admin) => {
    if(!await languageService.checkLanguageByKey(lang)) throw functions.badRequest('Wrong language key');
    return localeModel.findAll({include:[{association:'value', attributes:{exclude:['id']}}]})
        .then(result =>  {
            let resultList = [];
            result.forEach(locale => {
                resultList.push({
                    id:locale.id,
                    key:locale.key,
                    value:admin ? locale.value : locale.value[lang],
                })
            });
            return resultList;
        })
};

const getLocaleById = async (id, lang = constants.DefaultLanguage, admin) => {
    if(!await languageService.checkLanguageByKey(lang)) throw functions.badRequest('Wrong language key');
    return localeModel.findOne({where:{id}, include:[{association:'value', attributes:{exclude:['id']}}]})
        .then(locale =>  {
            return {
                id:locale.id,
                key:locale.key,
                value:admin ? locale.value : locale.value[lang],
            }
        })
};

const editLocale = async (id, key, value) => {
    if(!id) throw functions.badRequest('Id is required');
    if(!key)throw functions.badRequest('Key is required');
    if(!value) throw functions.badRequest('Value is required');

    else if(key.length === 0) throw functions.badRequest('Empty key params');

    let locale = await localeModel.findByPk(id);
    if(!locale)throw functions.badRequest('Wrong id');
    await stringsService.editString(value, locale.valueId);
    return locale.update({key}, {returning: true})
        .then(response => {
        return getLocaleById(response.id, 'eng', true);
        })
        .catch(error => {
            if(error.name === 'SequelizeUniqueConstraintError'){
                throw functions.badRequest('This key already exist')
            }else throw error;
        })
};

const deleteLocale = async (id) => {
    if(!id) throw functions.badRequest('id is required');
    let locale = await localeModel.findByPk(id);
    if(!locale) throw functions.badRequest('Wrong id');
    return db.transaction()
        .then(async transaction => {
            await stringsService.deleteString(locale.valueId, transaction);
            return locale.destroy({transaction})
                .then(result => {
                    transaction.commit();
                    return result;
                })
                .catch(error => {
                    transaction.rollback();
                    throw error;
                })
        })
        .catch(error => {
           throw error;
        });
};

module.exports = {
    addLocale,
    getLocale,
    editLocale,
    deleteLocale
};