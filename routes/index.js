const express = require('express');
const router = express.Router();

const languageRouter = require('./languageRouter');
const categoryRouter = require('./categoryRouter');
const subCategoryRouter = require('./subCategoryRouter');
const imageRouter = require('./imageRouter');
const productRouter = require('./productRouter');
const colorRouter = require('./colorRouter');
const localeRouter = require('./localeRouter');
const propertiesRouter = require('./propertyRouter');
const parametersRouter = require('./parametersRouter');

router.use("/languages", languageRouter);
router.use("/categories", categoryRouter);
router.use("/subCategories", subCategoryRouter);
router.use("/image", imageRouter);
router.use("/products", productRouter);
router.use("/colors", colorRouter);
router.use("/locale", localeRouter);
router.use("/properties", propertiesRouter);
router.use("/parameters", parametersRouter);

router.use((req, res, next) => {
    if (!req.route) {
        res.status(404);
        req.data = 'route not found'
    }
    next();
});

router.use(async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.json(req.data);
});

module.exports = router;
