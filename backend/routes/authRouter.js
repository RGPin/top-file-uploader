const express = require("express");
const controller = require("../controllers/authControllers");
const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/check", controller.checkAuth);

module.exports = router;
