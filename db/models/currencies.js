const Sequelize = require('sequelize');
const db = require('../index');

const Currencies = db.define("currencies",{
    name:{
        type:Sequelize.STRING
    },
    key:{
        type:Sequelize.STRING
    }
},{timestamps:false,});

Currencies.sync({alter:true});

module.exports = Currencies;
