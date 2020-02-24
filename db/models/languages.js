const Sequelize = require("sequelize");
const db = require('../index');

const Languages = db.define("languages",{
    name:{
        type:Sequelize.TEXT,
        unique:true
    }
},{timestamps:false});

Languages.sync({alter:true});

module.exports = Languages;
