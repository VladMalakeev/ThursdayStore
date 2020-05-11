const Sequelize = require("sequelize");
const db = require('../index');
const Properties = require('./properties');
const Products = require('./products');

const Products_Properties = db.define('products_properties',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    productId:{
        type:Sequelize.INTEGER,
        references:{
            model:Products,
            key:'id'
        }
    },
    propertyId:{
        type:Sequelize.INTEGER,
        references:{
            model:Properties,
            key:'id'
        }
    }
},{timestamps:false});

Properties.belongsToMany(Products, {through:Products_Properties});
Products.belongsToMany(Properties, {through:Products_Properties});

Products_Properties.sync({alter:true});

module.exports = Products_Properties;
