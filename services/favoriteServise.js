const constants = require('../utils/Constants');
const favoritesModel = require('../db/models/favorites');
const productModel = require('../db/models/products');
const functions = require('../utils/functions');

const addToFavorites = async (productId, userId) => {
    return favoritesModel.create({productId, userId});
};

const getFavorites = async (userId, lang = constants.DefaultLanguage, currency = constants.DefaultCurrency) => {
    return favoritesModel.findAll({
        where:userId,
        include:[
            {model:productModel, include:[
                    {association:'name'},
                    {association:'description'},
                    {association:'price'},
                    {association:'images'}
                ]}
            ]})
        .then(result => {
          return result.map(element => {
              return {
                  id: element.product.id,
                  name: functions.checkIsExistString(element.product.name, lang),
                  description: functions.checkIsExistString(element.product.description, lang),
                  images: element.product.images.map(image => image.name),
                  price: functions.checkIsExistPrice(element.product.price,currency)
              }
          })
        })
};

const deleteFromFavorites = async (productId, userId) => {
    let result = await favoritesModel.destroy({where:{productId:productId, userId:userId}});
    if(!result) throw functions.badRequest('wrong product or userId');
    return result;
};

module.exports = {
    addToFavorites,
    getFavorites,
    deleteFromFavorites
};