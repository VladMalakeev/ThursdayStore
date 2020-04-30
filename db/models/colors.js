const Sequelize = require("sequelize");
const db = require('../index');

const Colors = db.define("colors",{
    key:{
        type:Sequelize.STRING,
        unique:true
    },
    value:{
        type:Sequelize.STRING
    }
},{timestamps:false});

Colors.sync({alter:true});

module.exports = Colors;