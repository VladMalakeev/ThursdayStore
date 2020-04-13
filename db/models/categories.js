const Sequelize = require("sequelize");
const db = require('../index');
const Images = require('./images');
const Strings = require('./strings');

const Categories = db.define("categories",{
    nameId:{
        type:Sequelize.INTEGER,
        references:{
            model:Strings,
            key:'id'
        }
    },
    imageId:{
        type:Sequelize.INTEGER,
        references:{
            model:Images,
            key:"id"
        }
    }
},{timestamps:false});

Categories.belongsTo(Strings,{as:'strings', foreignKey:'nameId'});
Categories.belongsTo(Images,{as:'images', foreignKey:'imageId'});
Categories.sync({alter:true});

module.exports = Categories;
