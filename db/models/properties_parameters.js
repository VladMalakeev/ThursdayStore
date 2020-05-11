const Sequelize = require("sequelize");
const db = require('../index');
const Properties = require('./properties');
const Parameters = require('./parameters');
const ProductsProperties = require('./products_properties');

const Properties_Parameters = db.define('properties_parameters',{
    parameterId:{
        type:Sequelize.INTEGER,
        references:{
            model:Parameters,
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

ProductsProperties.hasMany(Properties_Parameters);
Properties_Parameters.belongsTo(ProductsProperties);

Properties.belongsToMany(Parameters, {through:Properties_Parameters});
Parameters.belongsToMany(Properties, {through:Properties_Parameters});

Properties_Parameters.sync({alter:true});

module.exports = Properties_Parameters;
