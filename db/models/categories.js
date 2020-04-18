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

Strings.hasOne(Categories,{foreignKey:'nameId'});
Images.hasOne(Categories, {foreignKey:'imageId'});
Categories.belongsTo(Strings,{as:'name'});
Categories.belongsTo(Images,{as:'image'});

Categories.sync({alter:true});

module.exports = Categories;
