const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');

router.use("/user", userRouter);

router.use(async function (req, res) {
    res.send(
        JSON.stringify(req.data)
    );
});

module.exports = router;
