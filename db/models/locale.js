const Sequelize = require("sequelize");
const db = require('../index');
const Strings = require('./strings');

const Locale = db.define("locale",{
    key:{
        type:Sequelize.STRING,
        unique:true
    },
    valueId:{
        type:Sequelize.INTEGER,
        references:{
            model:Strings,
            key:'id'
        }
    }
},{timestamps:false});

Strings.hasOne(Locale,{foreignKey:'valueId'});
Locale.belongsTo(Strings,{as:'value'});

Locale.sync({alter:true});

module.exports = Locale;