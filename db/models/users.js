const Sequelize = require("sequelize");
const db = require('../index');

const User = db.define("users",{
        name:{
            type:Sequelize.TEXT
        },
        age:{
            type:Sequelize.INTEGER
        }
});

module.exports = User;
