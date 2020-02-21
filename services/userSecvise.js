const userModel = require('../db/models/users');

const addUser = async (user) => {
  return userModel.create(user,{returning:true});
};

module.exports = {
  addUser
};