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

PropertiesParameters.belongsToMany(Products, {through:ProductsPropertiesParameters,onDelete:'CASCADE'});
Products.belongsToMany(PropertiesParameters, {through:ProductsPropertiesParameters,onDelete:'CASCADE'});

PropertiesParameters.hasMany(ProductsPropertiesParameters, {onDelete:'CASCADE'});
Products.hasMany(ProductsPropertiesParameters, {onDelete:'CASCADE'});

ProductsPropertiesParameters.belongsTo(Products);
ProductsPropertiesParameters.belongsTo(PropertiesParameters, {onDelete:'CASCADE'});



ProductsPropertiesParameters.sync({alter:true});

module.exports = ProductsPropertiesParameters;
