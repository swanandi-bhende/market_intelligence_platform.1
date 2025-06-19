// server/models/SentimentFeedback.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SentimentFeedbackSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    actualSentiment: {
        type: Number,
        required: true,
        min: -1,
        max: 1
    },
    predictedSentiment: {
        type: Number,
        min: -1,
        max: 1
    },
    method: {
        type: String,
        enum: ['keyword', 'emoji', 'hybrid', 'other']
    },
    feedbackDate: {
        type: Date,
        default: Date.now
    },
    processed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for faster queries
SentimentFeedbackSchema.index({ text: 'text' });
SentimentFeedbackSchema.index({ actualSentiment: 1 });
SentimentFeedbackSchema.index({ feedbackDate: -1 });
SentimentFeedbackSchema.index({ method: 1, processed: 1 });

module.exports = mongoose.model('SentimentFeedback', SentimentFeedbackSchema);