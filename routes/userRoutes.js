const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

// Auth pages
router.get("/signin", userController.renderSignin);
router.get("/signup", userController.renderSignup);

// Auth actions
router.post("/signin", userController.signin);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);

module.exports = router;
