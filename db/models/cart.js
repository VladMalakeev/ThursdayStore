const Sequelize = require('sequelize');
const db = require('../index');
const Products = require('./products');
const Users = require('./users');

const Cart = db.define("cart",{
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

Products.belongsToMany(Users,{through:Cart, foreignKey:'productId'});
Users.belongsToMany(Products, {through:Cart, foreignKey:'userId'});
Cart.belongsTo(Products);
Cart.belongsTo(Users);

Cart.sync({alter:true});

module.exports = Cart;