const Sequelize = require("sequelize");
const db = require('../index');
const Strings = require('./strings');
const Properties = require('./properties');

const Parameters = db.define('parameters', {
    nameId:{
        type:Sequelize.INTEGER,
        references:{
            model:Strings,
            key:'id'
        }
    }
},{timestamps:false});

Strings.hasOne(Parameters,{foreignKey:'nameId'});
Parameters.belongsTo(Strings, {as:'name'});

Properties.hasMany(Parameters, {as:'parameters', onDelete:'CASCADE'});
Parameters.belongsTo(Properties, {as:'property'});

Parameters.sync({alter:true});

module.exports = Parameters;