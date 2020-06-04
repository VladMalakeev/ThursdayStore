const express = require("express");
const router = express.Router();
const functions = require('../utils/functions');
const userMiddleware = require('../middleware/userMiddleware');
const favoriteService = require('../services/favoriteServise');

router.get('/', userMiddleware, (req, res, next) => {
    favoriteService.getFavorites(req.userId, req.query.lang, req.query.currency)
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
    favoriteService.addToFavorites(req.body.productId, req.userId)
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
    favoriteService.deleteFromFavorites(req.body.productId, req.userId)
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