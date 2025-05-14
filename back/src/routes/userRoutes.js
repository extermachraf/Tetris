const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {
  console.log("------------------------------profile--------------------");
  // req.user contains the decoded token payload
  res.status(200).json({
    success: true,
    data: {
      userId: req.user.id,
      email: req.user.email,
    },
  });
});

module.exports = router;
