const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");

router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.get("/logout/:id", auth, authController.logout);

module.exports = router;
