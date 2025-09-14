const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
// Get all polls
exports.getPolls = async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
};

// Create poll
exports.createPoll = async (req, res) => {
  const { title, description, options } = req.body;
  const poll = new Poll({ title, description, options });
  await poll.save();
  res.json(poll);
};

// Update poll
exports.updatePoll = async (req, res) => {
  const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(poll);
};

// Delete poll
exports.deletePoll = async (req, res) => {
  await Poll.findByIdAndDelete(req.params.id);
  res.json({ message: "Poll deleted" });
};

// Vote
// votePoll controller





// Vote controller with token-based auth
exports.votePoll = async (req, res) => {
  try {
    const { id: pollId } = req.params; // poll ID
    const { option } = req.body;

    // Citizenship comes from JWT via auth middleware
    const { citizenship } = req.user;
    if (!option || !citizenship) {
      return res.status(400).json({ message: "Missing option or invalid user" });
    }

    // Check if this voter has already voted for this poll
    const existingVote = await Vote.findOne({ poll: pollId, citizenship });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Record the vote
    const vote = new Vote({ poll: pollId, option, citizenship });
    await vote.save();

    // Increment the count in Poll model
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const pollOption = poll.options.find((o) => o.text === option);
    if (!pollOption) {
      return res.status(400).json({ message: "Invalid option" });
    }

    pollOption.count += 1;
    await poll.save();

    res.json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
