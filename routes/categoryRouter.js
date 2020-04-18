const express = require("express");
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminOptionalMiddleware = require('../middleware/adminOptionalMiddleware');
const imageUpload = require('../services/imagesService').categoryUpload;
const categoryService = require('../services/categoryService');
const functions = require('../utils/functions');

router.get('/:id?', adminOptionalMiddleware, (req, res, next) => {
    categoryService.getCategories(req.params.id, req.query.lang, req.admin)
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

router.post('/', adminMiddleware, imageUpload.single('image'), (req, res, next) => {
    categoryService.addCategory(req.body, req.file)
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

router.put('/', adminMiddleware, imageUpload.single('image'), (req, res, next) => {
    categoryService.editCategory(req.body.id, req.file, req.body.name)
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
    categoryService.deleteCategory(req.body.id)
        .then(response => {
            if(response){
                req.data = true;
                next();
            }else throw {
                status:400,
                info:'Wrong id'
            }
        })
        .catch(error => {
            res.status(functions.errorStatus(error));
            req.data = functions.errorInfo(error);
            next();
        })
});

module.exports = router;