const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
const validateUpload = require("../middlewares/validateUpload");
const uploadAvatar = require("../controllers/multer.controller");
const {
  verifyEmail,
  resendVerification,
} = require("../controllers/email.controller");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", auth, authController.logout);
router.get("/current", auth, authController.current);
router.patch("/avatars", auth, validateUpload, uploadAvatar);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", resendVerification);

module.exports = router;
