const express = require("express");
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminOptionalMiddleware = require('../middleware/adminOptionalMiddleware');
const imageUpload = require('../services/imagesService').categoryUpload;
const categoryService = require('../services/categoryService');

router.get('/:id?', adminOptionalMiddleware, (req, res, next) => {
    categoryService.getCategories(req.params.id, req.query.lang, req.admin)
        .then(response => {
            req.data = response;
            next();
        })
        .catch(error => {
            res.status(400);
            req.data = error;
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
            res.status(400);
            req.data = error;
            next();
        })
});

router.put('/', adminMiddleware, (req, res, next) => {

});

router.delete('/', adminMiddleware, (req, res, next) => {

});

module.exports = router;