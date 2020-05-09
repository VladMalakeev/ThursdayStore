const Sequelize = require("sequelize");
const db = require('../index');
const Strings = require('./strings');

const Properties = db.define('properties', {
    nameId:{
        type:Sequelize.INTEGER,
        references:{
            model:Strings,
            key:'id'
        }
    }
},{timestamps:false});

Strings.hasOne(Properties,{foreignKey:'nameId'});
Properties.belongsTo(Strings, {as:'name'});

Properties.sync({alter:true});

module.exports = Properties;