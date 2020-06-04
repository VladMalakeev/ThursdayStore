const express = require("express");
const router = express.Router();
const userService = require('../services/userService');

router.use(async (req, res, next) => {
    if (req.header("mac")){
       let user = await userService.checkUserByMacAddress(req.header("mac"));
       if(!user) {
           let newUser = await userService.createUserByMacAddress(req.header("mac"));
           req.userId = newUser.id;
       }else{
           req.userId = user.id;
       }
       req.mac = req.header("mac");
    }
    next();
});

module.exports = router;