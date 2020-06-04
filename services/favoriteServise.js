const constants = require('../utils/Constants');
const favoritesModel = require('../db/models/favorites');
const productModel = require('../db/models/products');
const functions = require('../utils/functions');


const addToFavorites = async (productId, userId) => {
    return favoritesModel.create({productId, userId});
};

const getFavorites = async (userId, lang = constants.DefaultLanguage, currency = constants.DefaultCurrency) => {
    if(!userId) throw functions.badRequest('wrong user id');
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
        .then(async result => {
            let resultArray = [];
          for(let element of result) {
              resultArray.push({
                  id: element.product.id,
                  name: functions.checkIsExistString(element.product.name, lang),
                  description: functions.checkIsExistString(element.product.description, lang),
                  images: element.product.images.map(image => image.name),
                  price: functions.checkIsExistPrice(element.product.price,currency),
                  inFavorites: userId ? await functions.checkIsFavorite(element.product.id, userId): undefined,
                  inCart: userId ? await functions.checkInCart(element.product.id, userId): undefined
              });
          }
          return resultArray;
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
    deleteFromFavorites,
};