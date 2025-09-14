const express = require("express");
const router = express.Router();
const {
  getPolls,
  createPoll,
  updatePoll,
  deletePoll,
  votePoll
} = require("../controllers/pollController");
const { authMiddleware } = require("../middleware/auth");

// CRUD
router.get("/", getPolls); // public
router.post("/", authMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}, createPoll);

router.patch("/:id", authMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}, updatePoll);

router.delete("/:id", authMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}, deletePoll);

// Voting
router.post("/vote/:id", authMiddleware, votePoll);

module.exports = router;
