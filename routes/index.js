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
const filterRouter = require('./filterRouter');
const userRouter = require('./userRouter');
const currencyRouter = require('./currencyRouter');
const favoriteRouter = require('./favoriteRouter');
const cartRouter = require('./cartRouter');

router.use("/languages", languageRouter);
router.use("/categories", categoryRouter);
router.use("/subCategories", subCategoryRouter);
router.use("/image", imageRouter);
router.use("/products", productRouter);
router.use("/colors", colorRouter);
router.use("/locale", localeRouter);
router.use("/properties", propertiesRouter);
router.use("/parameters", parametersRouter);
router.use("/filter", filterRouter);
router.use("/user", userRouter);
router.use("/currency", currencyRouter);
router.use("/favorite", favoriteRouter);
router.use("/cart", cartRouter);

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
