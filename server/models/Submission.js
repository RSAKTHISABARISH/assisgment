const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [{
    questionIndex: Number,
    selectedOption: String
  }],
  score: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  status: { type: String, default: 'Submitted' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
