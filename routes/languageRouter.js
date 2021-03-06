const express = require("express");
const router = express.Router();
const languageService = require('../services/languageService');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');

router.get('/', userMiddleware, (req, res, next) => {
    languageService.getAllLanguages()
        .then(languages => {
            req.data = languages;
            next();
        })
        .catch(error => {
            res.status(400);
            req.data = error;
            next();
        })
});

router.post('/', adminMiddleware, (req, res, next) => {
    languageService.addLanguage(req.body)
        .then(language => {
            req.data = language;
            next();
        })
        .catch(error => {
            res.status(400);
            req.data = error;
            next();
        })
});

router.delete('/', adminMiddleware, (req, res, next) => {
    languageService.removeLanguage(req.body.id)
        .then(result => {
            req.data = true;
            next();
        })
        .catch(error => {
            res.status(400);
            req.data = error;
            next();
        })
});

module.exports = router;