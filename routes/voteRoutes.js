const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");

// GET all votes
router.get("/", async (req, res) => {
  try {
    const votes = await Vote.find();
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new vote
router.post("/", async (req, res) => {
  try {
    const { pollId, option, citizenship } = req.body;

    // Prevent duplicate votes for same poll & citizenship
    const existingVote = await Vote.findOne({ pollId, citizenship });
    if (existingVote) return res.status(400).json({ message: "User already voted" });

    const vote = new Vote({ pollId, option, citizenship });
    await vote.save();
    res.status(201).json(vote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
