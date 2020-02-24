const express = require('express');
const router = express.Router();

const languageRouter = require('./languageRouter');

router.use("/languages", languageRouter);

router.use(async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.json(req.data);
});

module.exports = router;
