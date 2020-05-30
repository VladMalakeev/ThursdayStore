const Sequelize = require("sequelize");
const db = require('../index');
const Strings = require('./strings');
const SubCategories = require('./subCategories');
const Currencies = require('./currencies');

const Products = db.define("products",{
    nameId:{
        type:Sequelize.INTEGER,
        references:{
            model:Strings,
            key:'id'
        }
    },
    descriptionId:{
        type:Sequelize.INTEGER,
        references:{
            model:Strings,
            key:'id'
        }
    },
    categoryId:{
      type:Sequelize.INTEGER,
      references:{
          model:SubCategories,
          key:'id'
      }
    },
    priceId:{
        type:Sequelize.INTEGER,
        references:{
            model:Currencies,
            key:'id'
        }
    }
},{timestamps:false});

Strings.hasOne(Products,{foreignKey:'nameId'});
Strings.hasOne(Products,{foreignKey:'descriptionId'});
SubCategories.hasMany(Products, {foreignKey:'categoryId', onDelete:'SET NULL'});
Currencies.hasOne(Products,{foreignKey:'priceId',});

Products.belongsTo(Currencies, {as:'price'});
Products.belongsTo(Strings, {as:'name'});
Products.belongsTo(Strings, {as:'description'});
Products.belongsTo(SubCategories, {as:'category'});

Products.sync({alter:true});

module.exports = Products;
