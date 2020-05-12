const Sequelize = require("sequelize");
const db = require('../index');
const Properties = require('./properties');
const Parameters = require('./parameters');

const PropertiesParameters = db.define('propertiesParameters',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
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

Properties.hasMany(PropertiesParameters);
Parameters.hasMany(PropertiesParameters);
PropertiesParameters.belongsTo(Properties, {foreignKey:'propertyId'});
PropertiesParameters.belongsTo(Parameters, {foreignKey:'parameterId'});

PropertiesParameters.sync({alter:true});

module.exports = PropertiesParameters;
