const express = require('express');
const router = express.Router();

const languageRouter = require('./languageRouter');
const categoryRouter = require('./categoryRouter');
const subCategoryRouter = require('./subCategoryRouter');
const imageRouter = require('./imageRouter');
const productRouter = require('./productRouter');

router.use("/languages", languageRouter);
router.use("/categories", categoryRouter);
router.use("/subCategories", subCategoryRouter);
router.use("/image", imageRouter);
router.use("/products", productRouter);

router.use(async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.json(req.data);
});

module.exports = router;
