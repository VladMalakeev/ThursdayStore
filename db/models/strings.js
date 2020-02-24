const db = require('../index');

const Strings = db.define("strings",{},{timestamps:false,});

module.exports = Strings;
