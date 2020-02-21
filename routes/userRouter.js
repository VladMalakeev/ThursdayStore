const express = require("express");
const router = express.Router();
const userService = require('../services/userSecvise');

router.get('/', function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    userService.addUser(req.query)
        .then(user => {
            req.data = user;
            next();
        },error => {
            res.status(400);
            req.data = error;
            next();
        });
});

module.exports = router;