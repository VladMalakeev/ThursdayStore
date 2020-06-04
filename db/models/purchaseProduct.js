const Sequelize = require('sequelize');
const db = require('../index');
const Products = require('./products');
const Purchases = require('./purchases');

const PurchaseProducts = db.define("purchaseProduct",{
    productId:{
        type:Sequelize.INTEGER,
        references:{
            model:Products,
            key:'id'
        }
    },
    purchaseId:{
        type:Sequelize.INTEGER,
        references:{
            model:Purchases,
            key:'id'
        }
    }
},{timestamps:false,});

Products.belongsToMany(Purchases, {through:PurchaseProducts, foreignKey:'productId'});
Purchases.belongsToMany(Products, {through:PurchaseProducts, foreignKey:'purchaseId'});
PurchaseProducts.belongsTo(Products);
PurchaseProducts.belongsTo(Purchases);

PurchaseProducts.sync({alter:true});

module.exports = PurchaseProducts;