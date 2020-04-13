const express = require("express");
const router = express.Router();
const path = require('path');

router.get("/category/:image", function(req, res) {
    res.sendFile(path.resolve(`images/categories/${req.params.image}`));
});

router.get("/subcategory/:image", function(req, res) {
    res.sendFile(path.resolve(`images/subcategories/${req.params.image}`));
});

router.get("/product/:image", function(req, res) {
    res.sendFile(path.resolve(`images/product/${req.params.image}`));
});

module.exports = router;