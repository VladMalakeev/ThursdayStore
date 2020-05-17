const Sequelize = require('sequelize');
const db = require('../index');

const Strings = db.define("strings",{
    eng:{
        type:Sequelize.STRING
    },
    rus:{
        type:Sequelize.STRING
    },
    ukr:{
        type:Sequelize.STRING
    }
},{timestamps:false,});

Strings.sync({alter:true});

module.exports = Strings;
