const express = require("express");
const router = express.Router();
const functions = require('../utils/functions');
const userMiddleware = require('../middleware/userMiddleware');
const purchaseService = require('../services/purchaseService');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', userMiddleware, (req, res, next) => {
    purchaseService.getUserPurchases(req.userId, req.query.lang, req.query.currency)
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
    purchaseService.makePurchase(req.body, req.userId, req.body.lang, req.body.currency)
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

router.put('/', adminMiddleware, (req, res, next) => {
    purchaseService.editPurchaseType(req.body.purchaseId, req.body.statusId)
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

router.get('/statusList', adminMiddleware, (req, res, next) => {
    purchaseService.getPurchaseStatusList()
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

module.exports = router;