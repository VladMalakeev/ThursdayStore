const router = require('express').Router();
const functions = require('../utils/functions');
const propertyService = require('../services/propertyService');
const userMiddleware = require('../middleware/userMiddleware');

router.get('/', userMiddleware, (req, res, next) => {
    propertyService.getFiltersBySubCategoryId(req.query.catId, req.query.lang)
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