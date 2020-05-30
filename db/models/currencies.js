const Sequelize = require('sequelize');
const db = require('../index');

const Currencies = db.define("currencies",{
    usd:{
        type:Sequelize.REAL
    },
    rub:{
        type:Sequelize.REAL
    },
    uah:{
        type:Sequelize.REAL
    }
},{timestamps:false,});

Currencies.sync({alter:true});

module.exports = Currencies;
