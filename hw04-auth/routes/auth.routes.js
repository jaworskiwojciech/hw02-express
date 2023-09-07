const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", auth, authController.logout);
router.get("/current", auth, authController.current);

module.exports = router;
