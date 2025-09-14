const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: String,
  count: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  options: [optionSchema],
});

module.exports = mongoose.model("Poll", pollSchema);
