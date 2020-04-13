const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    if (req.header("Authorization") === "admin"){
        req.admin = true;
        next();
    }else{
        res.status(401);
        req.data = "no permissions";
        res.json(req.data);
    }
});

module.exports = router;