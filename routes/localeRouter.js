const express = require("express");
const router = express.Router();
const functions = require('../utils/functions');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminOptionalMiddleware = require('../middleware/adminOptionalMiddleware');
const localeService = require('../services/localeService');

router.get("/", adminOptionalMiddleware, (req, res, next) => {
    localeService.getLocale(req.query.lang, req.admin)
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

router.post("/", adminMiddleware, (req, res, next) => {
    localeService.addLocale(req.body.key, req.body.value)
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

router.put("/", adminMiddleware, (req, res, next) => {
    localeService.editLocale(req.body.id, req.body.key, req.body.value)
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

router.delete("/", adminMiddleware, (req, res, next) => {
    localeService.deleteLocale(req.body.id)
        .then(response => {
            req.data = "success";
            next();
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next();
        })
});

module.exports = router;