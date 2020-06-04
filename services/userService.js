const userModel = require('../db/models/users');
const functions = require('../utils/functions');
const enums = require('../utils/enums');

const checkUserByMacAddress = async (mac) => {
    return userModel.findOne({where:{mac}});
};

const createUserByMacAddress = async (mac) => {
    return userModel.create({mac}, {returning:true});
};

const getUserByMacAddress = async (mac) => {
    let user = await userModel.findOne({where:{mac}});
    if(!user) throw functions.badRequest('Wrong mac address!');
    return user
};

const editUserByMacAddress = async (obj, mac) => {
    let user = await userModel.findOne({where:{mac}});
    if(!user) throw functions.badRequest('Wrong mac address!');
    // if(obj.gender){
    //     if(!enums.gender.includes(obj.gender)) throw functions.badRequest('Wrong gender, mast be male or female');
    // }
    return user.update(obj,{where:{mac}, returning:true})
};

module.exports = {
    checkUserByMacAddress,
    createUserByMacAddress,
    getUserByMacAddress,
    editUserByMacAddress
};