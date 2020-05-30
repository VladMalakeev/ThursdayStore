const express = require("express");
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminOptionalMiddleware = require('../middleware/adminOptionalMiddleware');
const imageUpload = require('../services/imagesService').productUpload;
const functions = require('../utils/functions');
const productService = require('../services/productService');
const constants = require('../utils/Constants');

router.get('/:id?', adminOptionalMiddleware, (req, res, next) => {
    productService.getProduct(req.params.id, req.query.catId, req.query.lang, req.query.currency, req.admin)
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
    //productService.addProduct(req.body, req.files)
    let image = req.body.image ? req.body.image.map(image => {return {filename:image}}): [];
    productService.addProduct(req.body, image)
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
    //productService.editProduct(req.body, req.files)
    let image = req.body.image ? req.body.image.map(image => {return {filename:image}}): [];
    productService.editProduct(req.body, image)
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

router.post('/setProperties', adminMiddleware, (req, res, next) => {
    productService.setPropertiesForProduct(req.body.properties, req.body.productId)
        .then(async response => {
            req.data = await productService.getProduct(req.body.productId, null, 'eng', req.admin);
            next();
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next();
        })
});

router.post('/filter', (req, res, next) => {
    productService.applyFilter(req.body.catId, req.body.filters, req.body.prices, req.body.lang)
        .then(async response => {
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