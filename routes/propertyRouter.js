const router = require('express').Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminOptionalMiddleware = require('../middleware/adminOptionalMiddleware');
const functions = require('../utils/functions');
const propertyService = require('../services/propertyService');

router.get('/', adminOptionalMiddleware, (req, res, next) => {
    propertyService.getProperties(req.query.lang, req.admin)
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


router.post('/', adminMiddleware, (req, res, next) => {
    propertyService.addProperties(req.body.properties)
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

router.put('/', adminMiddleware, (req, res, next) => {
    propertyService.editProperty(req.body.name, req.body.id)
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

router.delete('/', adminMiddleware, (req, res, next) => {
    propertyService.deleteProperty(req.body.id)
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