const express = require("express");
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminOptionalMiddleware = require('../middleware/adminOptionalMiddleware');
const imageUpload = require('../services/imagesService').productUpload;
const functions = require('../utils/functions');
const productService = require('../services/productServise');
const constants = require('../utils/Constants');

router.get('/:id?', adminOptionalMiddleware, (req, res, next) => {
    productService.getProduct(req.params.id, req.query.catId, req.query.lang, req.admin)
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

router.post('/', adminMiddleware, imageUpload.array('image', constants.ImagesLimit), (req, res, next) => {
    productService.addProduct(req.body, req.files)
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

router.put('/', adminMiddleware, imageUpload.array('image', constants.ImagesLimit), (req, res, next) => {
    productService.editProduct(req.body, req.files)
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
    productService.deleteProduct(req.body.id)
        .then(response => {
            if(response){
                req.data = true;
                next();
            }else throw functions.badRequest('Wrong id');
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next();
        })
});

module.exports = router;