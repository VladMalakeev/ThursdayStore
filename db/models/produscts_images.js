const Sequelize = require("sequelize");
const db = require('../index');
const Images = require('./images');
const Products = require('./products');

const Products_Images = db.define("products_images",{
    productId:{
        type:Sequelize.INTEGER,
        references:{
            model:Products,
            key:'id'
        }
    },
    imageId:{
        type:Sequelize.INTEGER,
        references:{
            model:Images,
            key:"id"
        }
    }
},{timestamps:false});

Products.belongsToMany(Images, {through:Products_Images, as:'images'});
Images.belongsToMany(Products,{through:Products_Images});

Products_Images.sync({alter:true});

module.exports = Products_Images;
