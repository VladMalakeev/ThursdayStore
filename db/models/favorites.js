const Sequelize = require('sequelize');
const db = require('../index');
const Products = require('./products');
const Users = require('./users');

const Favorites = db.define("favorites",{
    userId:{
        type:Sequelize.INTEGER,
        references:{
            model:Users,
            key:'id'
        }
    },
    productId:{
        type:Sequelize.INTEGER,
        references:{
            model:Products,
            key:'id'
        }
    }
},{timestamps:false,});

Products.belongsToMany(Users,{through:Favorites, foreignKey:'productId'});
Users.belongsToMany(Products, {through:Favorites, foreignKey:'userId'});
Favorites.belongsTo(Products);
Favorites.belongsTo(Users);

Favorites.sync({alter:true});

module.exports = Favorites;