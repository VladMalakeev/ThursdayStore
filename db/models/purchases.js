const Sequelize = require('sequelize');
const db = require('../index');
const Users = require('./users');
const PurchaseTypes = require('./purchaseTypes');

const Purchases = db.define("purchases",{
    userId:{
        type:Sequelize.INTEGER,
        references:{
            model:Users,
            key:'id'
        }
    },
    statusId:{
        type:Sequelize.INTEGER,
        references:{
            model:PurchaseTypes,
            key:'id'
        }
    },
    deliveryType:{
        type:Sequelize.STRING
    },
    address:{
        type:Sequelize.STRING
    },
    date:{
        type:Sequelize.DATE
    },
    bill:{
        type:Sequelize.STRING
    }
},{timestamps:false});

PurchaseTypes.hasOne(Purchases,{foreignKey:'statusId'});
Purchases.belongsTo(PurchaseTypes,{as:'status'});

Users.hasMany(Purchases,{onDelete:'CASCADE'});
Purchases.belongsTo(Users);

Purchases.sync({alter:true});

module.exports = Purchases;