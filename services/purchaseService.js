const functions = require('../utils/functions');
const purchaseModel = require('../db/models/purchases');
const purchaseProductModel = require('../db/models/purchaseProduct');
const cartModel = require('../db/models/cart');
const productModel = require('../db/models/products');
const constants  = require('../utils/Constants');
const priceService = require('./pricesService');
const cartService = require('./cartService');
const enums = require('../utils/enums');
const db = require('../db/index');
const purchaseTypeModel = require('../db/models/purchaseTypes');

const makePurchase = async (body, userId, lang = constants.DefaultLanguage, currency = constants.DefaultCurrency) => {
    currency = await priceService.checkCurrency(currency);

    let productsInCart = await cartModel.findAll({where:{userId:userId},
        include:[
            {model:productModel, include:[
                    {association:'price'}
                ]}
        ]});
    if(productsInCart.length === 0) throw functions.badRequest('Cart is empty for this user!!!');
    let purchaseObj = {
        bill: 0,
        userId: userId,
        statusId:1,
        deliveryType:body.deliveryType,
        address:body.address,
        date:new Date()
    };
    productsInCart.forEach(cart => {
        if(!cart.product.price[currency]) throw functions.badRequest(`product with id - ${cart.product.id} have not ${currency} currency`);
        purchaseObj.bill += cart.product.price[currency]
    });
    purchaseObj.bill =  purchaseObj.bill+enums.currencies[currency];

    return  db.transaction()
        .then(async transaction => {
        let newPurchase = await purchaseModel.create(purchaseObj, {transaction, returning:true});
        let purchaseProductArray = productsInCart.map(cart => {
            return {
                productId:cart.product.id,
                purchaseId:newPurchase.id
            }
        });
        return purchaseProductModel.bulkCreate(purchaseProductArray, {transaction})
            .then(async result => {
                transaction.commit();
                await cartService.clearCartByUserId(userId);
                return getPurchaseById(newPurchase.id, lang, currency);
            })
            .catch(error => {
                transaction.rollback();
                throw error;
            })
    });
};

const getPurchaseById = async (id, lang, currency) => {
    return  purchaseModel.findOne({where:{id:id},   include:[
            {association:'status',include:[{association:'name'}]},
            {model:productModel, include:[
                    {association:'name'},
                    {association:'description'},
                    {association:'price'},
                    {association:'images'}
                ]}
        ]})
        .then(purchase => {
            console.log(purchase)
            return {
                id:purchase.id,
                status:functions.checkIsExistString(purchase.status.name, lang),
                deliveryType: purchase.deliveryType,
                address: purchase.address,
                date:purchase.date,
                bill:purchase.bill,
                products:purchase.products.map(product => {
                    return {
                        id:product.id,
                        name:functions.checkIsExistString(product.name,lang),
                        description:functions.checkIsExistString(product.description,lang),
                        price: functions.checkIsExistPrice(product.price, currency),
                        images: product.images ? product.images.map(image => image.name) : null,
                    }
                })
            }
        })
};

const getUserPurchases = async (userId, lang = constants.DefaultLanguage, currency = constants.DefaultCurrency) => {
   return  purchaseModel.findAll({where:{userId:userId},
       include:[
           {association:'status',include:[{association:'name'}]},
           {model:productModel, include:[
                   {association:'name'},
                   {association:'description'},
                   {association:'price'},
                   {association:'images'}
               ]}
           ]})
       .then(purchases => {
           return purchases.map(purchase => {
               return {
                   id:purchase.id,
                   status:functions.checkIsExistString(purchase.status.name, lang),
                   deliveryType: purchase.deliveryType,
                   address: purchase.address,
                   date:purchase.date,
                   bill:purchase.bill,
                   products:purchase.products.map(product => {
                       return {
                           id:product.id,
                           name:functions.checkIsExistString(product.name,lang),
                           description:functions.checkIsExistString(product.description,lang),
                           price: functions.checkIsExistPrice(product.price, currency),
                           images: product.images ? product.images.map(image => image.name) : null,
                       }
                   })
               }
           })
       })
};

const editPurchaseType = async (purchaseId, typeId) => {
    let type = await purchaseTypeModel.findOne({where:{id:typeId}});
    if(!type) throw functions.badRequest('Wrong type id');
    return purchaseModel.update({statusId:typeId},{where:{id:purchaseId}});
};

const getPurchaseStatusList = async () => {
    return purchaseTypeModel.findAll({include:[{association:'name', attributes:{exclude:['id']}}]})
        .then(response => {
            return response.map(item => {
                return {
                    id:item.id,
                    name:item.name
                }
            })
        })
};

module.exports = {
    makePurchase,
    getUserPurchases,
    editPurchaseType,
    getPurchaseStatusList
};