const express = require("express");
const router = express.Router();
const userModel = require("../Model/userSchema");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/author", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Access denied",
      });
    }

    const authors = await userModel.find(
      { role: "author" }
    ).select("name email role");

    return res.status(200).json({
      status: true,
      message: "Authors fetched successfully",
      authors: authors
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch authors",
    });
  }
});

module.exports = router;