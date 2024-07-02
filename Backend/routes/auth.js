const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { validateAccessToken } = require("../middlewares/auth");

router.post("/signup", authController.userSignup);
router.post("/login", authController.userLogin);
router.post("/forgot-password", authController.userForgotpassword);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", authController.refreshAccessToken);
router.get("/get-user-info", validateAccessToken, authController.getUserInfo);
router.get("/buy-premium", validateAccessToken, authController.premiumOrder);
router.post(
  "/update-premium-status",
  validateAccessToken,
  authController.updatePaymentStatus
);

module.exports = router;
