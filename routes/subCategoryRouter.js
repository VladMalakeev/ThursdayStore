const express = require("express");
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminOptionalMiddleware = require('../middleware/adminOptionalMiddleware');
const imageUpload = require('../services/imagesService').subCategoryUpload;
const subCategoryService = require('../services/subCategoryService');
const functions = require('../utils/functions');
const userMiddleware = require('../middleware/userMiddleware');

router.get('/:id?', adminOptionalMiddleware, userMiddleware, (req, res, next) => {
    subCategoryService.getSubCategories(req.params.id, req.query.catId, req.query.lang, req.admin)
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
   // subCategoryService.addSubCategory(req.body.name, req.body.catId, req.file)
    subCategoryService.addSubCategory(req.body.name, req.body.catId, {filename:req.body.image})
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
    //subCategoryService.editSubCategory(req.body.id, req.body.catId, req.file, req.body.name)
    subCategoryService.editSubCategory(req.body.id, req.body.catId, {filename:req.body.image}, req.body.name)
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
    subCategoryService.deleteSubCategory(req.body.id)
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