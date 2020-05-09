const router = require('express').Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminOptionalMiddleware = require('../middleware/adminOptionalMiddleware');
const functions = require('../utils/functions');
const parametersService = require('../services/parametersService');

router.get('/', adminOptionalMiddleware, (req, res, next) => {
    parametersService.getParameters(req.query.lang, req.query.propertyId, req.admin)
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
    parametersService.addParameters(req.body.propertyId,req.body.parameters)
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
    parametersService.editParameter(req.body.name, req.body.id, req.body.propertyId)
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
    parametersService.deleteParameter(req.body.id)
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