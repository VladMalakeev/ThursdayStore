const defaultLanguage = require('./Constants').DefaultLanguage;
const defaultCurrency = require('./Constants').DefaultCurrency;
const cartModel = require('../db/models/cart');
const favoritesModel = require('../db/models/favorites');
const enums = require("./enums");

const errorStatus = (error) => {
    return error.status ? error.status : 500;
};

const errorInfo = (error) => {
    if (process.env.NODE_ENV === 'production') {
        return error.message ? error.message : 'Internal Server Error';
    } else {
        return error.message ? error.message : error;
    }
};

const badRequest = (message) => {
    return {
        status: 400,
        message: message
    }
};

const internalError = (message) => {
    return {
        status: 500,
        message: message
    }
};

const isArray = (parameter, name) => {
    if (!Array.isArray(parameter)) throw badRequest(`${name} must be an array!`);
    if(parameter.length === 0) throw badRequest(`${name} is empty`);

    return true;

};

const parseString = (string, name) => {
    if(typeof string === 'string') {
        try {
            return JSON.parse(string);
        } catch (e) {
            throw badRequest(`Wrong ${name} object!`)
        }
    }else return string;
};

const checkIsExistString = (object, lang) => {
    if(object[lang]) return object[lang];
    else return object[defaultLanguage];
};

const checkIsExistPrice = (object, currency) => {
    if(object[currency]) return object[currency]+enums.currencies[currency];
    else return object[defaultCurrency]+enums.currencies[defaultCurrency];
};

const checkIsFavorite = async (productId, userId) => {
    if(!userId) return false;
    let result = await favoritesModel.findOne({where:{productId:productId, userId:userId}});
    if(result) return true;
    return false;
};

const checkInCart = async (productId, userId) => {
    if(!userId) return false;
    let result = await cartModel.findOne({where:{productId:productId, userId:userId}});
    if(result) return true;
    return false;
};

module.exports = {
    parseString,
    errorInfo,
    errorStatus,
    badRequest,
    isArray,
    internalError,
    checkIsExistString,
    checkIsExistPrice,
    checkIsFavorite,
    checkInCart
};