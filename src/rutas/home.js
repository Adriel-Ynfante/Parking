const express = require("express");
const router = express.Router();
const link = require("../../config/link");

router.get("/home", (req, res) => {
    if (!req.session.login) {
        res.render("index", {link});
    } else {
        res.render("home", {datos: req.session, link});
    }
});

module.exports = router;
