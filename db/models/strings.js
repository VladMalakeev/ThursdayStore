const Sequelize = require('sequelize');
const db = require('../index');

const Strings = db.define("strings",{
    eng:{
        type:Sequelize.TEXT
    },
    rus:{
        type:Sequelize.TEXT
    },
    ukr:{
        type:Sequelize.TEXT
    }
},{timestamps:false,});

Strings.sync({alter:true});

module.exports = Strings;
