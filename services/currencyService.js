const currencyModel = require("../db/models/currencies");
const enums = require("../utils/enums");
const functions = require('../utils/functions');

const checkCurrency = async (currency) => {
    if(!Object.keys(enums.currencies).includes(currency)) throw functions.badRequest('Invalid currency name');
    return true;
};

const checkPrice = async (price) => {
    if (!price) throw functions.badRequest('Price is required');
    let currenciesList = Object.keys(price);
    let pricesList = Object.values(price);
    if(currenciesList.length === 0) throw functions.badRequest('Price is required');
    currenciesList.forEach(curency => {
        if(!Object.keys(enums.currencies).includes(curency)) throw functions.badRequest('Invalid currency name');
    });
    pricesList.forEach(priceValue => {
        let value = parseFloat(priceValue);
        if (!value) {
            throw functions.badRequest('Invalid price format');
        } else {
            if (value < 0) throw functions.badRequest('Invalid price value');
        }
    });
return true;
};

const addCurrency = async (object, transaction) => {
    await checkPrice(object);
    return currencyModel.create(object, {returning:true, transaction})
};

const editCurrency = async (object, id, transaction) => {
    await checkPrice(object);
    return currencyModel.update(object,{where:{id},returning:true, transaction});
};

const deleteCurrency = async (id, transaction) => {
    return currencyModel.destroy({where:{id}}, {transaction});
};

module.exports = {
    checkPrice,
    addCurrency,
    editCurrency,
    checkCurrency,
    deleteCurrency
};