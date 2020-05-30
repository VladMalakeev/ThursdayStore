const express = require("express");
const router = express.Router();
const userService = require('../services/userService');

router.use(async (req, res, next) => {
    if (req.header("mac")){
       let user = await userService.checkUserByMacAddress(req.header("mac"));
       if(!user) await userService.createUserByMacAddress(req.header("mac"));
       req.mac = req.header("mac");
    }
    next();
});

module.exports = router;