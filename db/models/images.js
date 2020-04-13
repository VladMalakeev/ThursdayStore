const Sequelize = require("sequelize");
const db = require('../index');

const Images = db.define("images",{
    name:{
        type:Sequelize.TEXT,
        unique:true
    }
},{timestamps:false});

Images.sync({alter:true});

module.exports = Images;