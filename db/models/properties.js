const Sequelize = require("sequelize");
const db = require('../index');
const Strings = require('./strings');
const SubCategory = require('./subCategories');

const Properties = db.define('properties', {
    nameId:{
        type:Sequelize.INTEGER,
        references:{
            model:Strings,
            key:'id'
        }
    },
    subCategoryId:{
        type:Sequelize.INTEGER,
        references:{
            model:SubCategory,
            key:'id'
        }
    }
},{timestamps:false});

Strings.hasOne(Properties,{foreignKey:'nameId'});
Properties.belongsTo(Strings, {as:'name'});

SubCategory.hasOne(Properties, {foreignKey:'subCategoryId'});
Properties.belongsTo(SubCategory, {as:'subCategory'});

Properties.sync({alter:true});

module.exports = Properties;