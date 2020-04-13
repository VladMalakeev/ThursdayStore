const Sequelize = require("sequelize");
const db = require('../index');

const Languages = db.define("languages",{
    key:{
        type:Sequelize.TEXT,
        unique:true
    },
    name:{
        type:Sequelize.TEXT,
        required:true
    }
},{timestamps:false});

Languages.sync({alter:true});

module.exports = Languages;
