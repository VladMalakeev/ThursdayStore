const express = require("express");
const router = express.Router();
const functions = require('../utils/functions');
const userService = require('../services/userService');
const userMiddleware = require('../middleware/userMiddleware');

router.get('/', userMiddleware, (req, res, next) => {
    userService.getUserByMacAddress(req.mac)
        .then(response => {
            req.data = response;
            next();
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next();
        })
});

router.put('/', userMiddleware, (req, res, next) => {
    userService.editUserByMacAddress(req.body, req.mac)
        .then(response => {
            req.data = response;
            next();
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next();
        })
});

module.exports = router;