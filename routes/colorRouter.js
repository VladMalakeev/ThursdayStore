const express = require("express");
const router = express.Router();
const colorService = require("../services/colorService");
const functions = require('../utils/functions');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get("/", (req, res, next) => {
    colorService.getColors()
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
    colorService.addColor(req.body.key, req.body.value)
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
    colorService.editColor(req.body.id, req.body.key, req.body.value)
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
    colorService.deleteColor(req.body.id)
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