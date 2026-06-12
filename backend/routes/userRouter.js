const express = require("express");
const { checkAuth } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");
const controller = require("../controllers/userControllers");
const router = express.Router();

router.use(checkAuth);
router.get("/profile", controller.getUserProfile);
router.post("/upload", multerUpload.single("file"), controller.uploadFile);

module.exports = router;
