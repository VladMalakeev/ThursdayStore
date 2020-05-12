const Sequelize = require("sequelize");
const db = require('../index');
const PropertiesParameters = require('./properties_parameters');
const Products = require('./products');

const ProductsPropertiesParameters = db.define('productsPropertiesParameters',{
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
    propertiesParameterId:{
        type:Sequelize.INTEGER,
        references:{
            model:PropertiesParameters,
            key:'id'
        }
    }
},{timestamps:false});

PropertiesParameters.belongsToMany(Products, {through:ProductsPropertiesParameters});
Products.belongsToMany(PropertiesParameters, {through:ProductsPropertiesParameters});

PropertiesParameters.hasMany(ProductsPropertiesParameters);
Products.hasMany(ProductsPropertiesParameters);

ProductsPropertiesParameters.belongsTo(Products);
ProductsPropertiesParameters.belongsTo(PropertiesParameters);

ProductsPropertiesParameters.sync({alter:true});

module.exports = ProductsPropertiesParameters;
