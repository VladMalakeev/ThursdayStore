const express = require("express");
const router = express.Router();
const currencyModel = require('../db/models/currencies');
const functions = require('../utils/functions');
const userMiddleware = require('../middleware/userMiddleware');

router.get('/', userMiddleware, (req, res, next) => {
    currencyModel.findAll()
        .then(currencies => {
            req.data = currencies;
            next();
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next();
        })
});

module.exports = router;