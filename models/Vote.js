const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
  option: String,
  citizenship: String,
});

module.exports = mongoose.model("Vote", voteSchema);
