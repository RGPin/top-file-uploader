const express = require("express");
const { protectRoute } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");
const controller = require("../controllers/userControllers");
const router = express.Router();

router.use(protectRoute);
router.get("/profile", controller.getUserProfile);
router.post("/upload", multerUpload.single("file"), controller.uploadFile);
router.get("/userfiles", controller.getUploadedFiles);

module.exports = router;
