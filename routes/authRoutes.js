const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateDetails,
} = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/signup", register);
router.post("/login", login);
// Update user details
router.put("/user", verifyToken, updateDetails);

module.exports = router;
