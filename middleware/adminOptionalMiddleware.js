const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    if (req.header("Authorization") === "admin"){
        req.admin = true;
        next();
    }else{
       next()
    }
});

module.exports = router;