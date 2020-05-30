const Sequelize = require("sequelize");
const db = require('../index');


const User = db.define("users",{
    mac:{
        type:Sequelize.STRING,
        unique:true
    },
    name:{
        type:Sequelize.STRING
    },
    lastName:{
        type:Sequelize.STRING,
    },
    patronymic:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING
    },
    gender:{
        type:Sequelize.STRING
    },
    birthDay:{
      type:Sequelize.DATEONLY
    },
    phone:{
        type:Sequelize.STRING
    },
    city:{
        type:Sequelize.STRING
    },
    address:{
        type:Sequelize.STRING
    }


},{timestamps:false});

User.sync({alter:true});

module.exports = User;