const Sequelize = require('sequelize');
const db = require('../index');
const Strings = require('./strings');

const PurchaseTypes = db.define("purchase_types",{
    nameId:{
        type:Sequelize.INTEGER,
        references:{
            model:Strings,
            key:'id'
        }
    }
},{timestamps:false});

Strings.hasOne(PurchaseTypes, {foreignKey:'nameId'});
PurchaseTypes.belongsTo(Strings, {as:'name'});

PurchaseTypes.sync({alter:true});

module.exports = PurchaseTypes;