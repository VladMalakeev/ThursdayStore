const express = require("express");
const router = express.Router();
const functions = require('../utils/functions');
const userMiddleware = require('../middleware/userMiddleware');
const cartService = require('../services/cartService');

router.get('/', userMiddleware, (req, res, next) => {
    cartService.getProductsFromCart(req.userId, req.query.lang, req.query.currency)
        .then(result => {
            req.data = result;
            next();
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next()
        })
});

router.post('/', userMiddleware, (req, res, next) => {
    cartService.addProductToCart(req.body.productId, req.userId)
        .then(result => {
            req.data = true;
            next();
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next()
        })
});

router.delete('/', userMiddleware, (req, res, next) => {
    cartService.deleteProductsFromCart(req.body.productId, req.userId)
        .then(result => {
            req.data = true;
            next();
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next()
        })
});

module.exports = router;