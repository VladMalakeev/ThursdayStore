const express = require('express');
const router = express.Router();

const languageRouter = require('./languageRouter');
const categoryRouter = require('./categoryRouter');
const imageRouter = require('./imageRouter');

router.use("/languages", languageRouter);
router.use("/categories", categoryRouter);
router.use("/image", imageRouter);

router.use(async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.json(req.data);
});

module.exports = router;
