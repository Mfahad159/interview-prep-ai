const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// Upload profile image
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.log("Upload failed: No file provided");
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  console.log("Image uploaded successfully:", imageUrl);
  res.status(200).json({ imageUrl });
});

module.exports = router;
