const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
