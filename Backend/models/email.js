const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transcript: { type: String, required: true },
    generatedEmail: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Email', emailSchema);