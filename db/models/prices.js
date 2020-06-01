const Sequelize = require('sequelize');
const db = require('../index');

const Prices = db.define("prices",{
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

Prices.sync({alter:true});

module.exports = Prices;
