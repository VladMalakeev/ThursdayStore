const Sequelize = require("sequelize");
const db = require('../index');
const Images = require('./images');
const Strings = require('./strings');
const Categories = require('./categories');

const SubCategories = db.define("subCategories",{
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
            key:'id'
        }
    },
    categoryId:{
        type:Sequelize.INTEGER,
        references:{
            model:Categories,
            ket:'id'
        }
    }
},{timestamps:false});

Strings.hasOne(SubCategories,{foreignKey:'nameId'});
Images.hasOne(SubCategories, {foreignKey:'imageId', onDelete:'NO ACTION'});
SubCategories.belongsTo(Strings, {as:'name'});
SubCategories.belongsTo(Images,{as:'image'});

Categories.hasMany(SubCategories, {foreignKey:'categoryId',onDelete:'CASCADE'});
SubCategories.belongsTo(Categories);

SubCategories.sync({alter:true});

module.exports = SubCategories;
