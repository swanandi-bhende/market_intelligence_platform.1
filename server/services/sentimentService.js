// server/services/sentimentService.js

const KeywordAnalyzer = require('../utils/keywordAnalyzer');
const EmojiAnalyzer = require('../utils/emojiAnalyzer');
const Feedback = require('../models/SentimentFeedback');

class SentimentAnalysis {
    static async analyze(text, options = {}) {
        const { language = 'en', method = 'keyword' } = options;
        
        let result;
        switch (method) {
            case 'keyword':
                result = KeywordAnalyzer.analyze(text, language);
                break;
            case 'emoji':
                result = EmojiAnalyzer.analyze(text);
                break;
            case 'hybrid':
                const keywordResult = KeywordAnalyzer.analyze(text, language);
                const emojiResult = EmojiAnalyzer.analyze(text);
                result = {
                    sentiment: (keywordResult.sentiment + emojiResult.sentiment) / 2,
                    normalized: (keywordResult.normalized + emojiResult.normalized) / 2,
                    keywords: [...keywordResult.keywords, ...emojiResult.keywords],
                    method: 'hybrid'
                };
                break;
            default:
                throw new Error(`Unknown analysis method: ${method}`);
        }

        return {
            ...result,
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), // Return truncated text
            length: text.length,
            method
        };
    }

    static async addFeedback(text, actualSentiment, predictedSentiment, method) {
        const feedback = new Feedback({
            text: text.substring(0, 500), // Store first 500 chars
            actualSentiment,
            predictedSentiment,
            method,
            feedbackDate: new Date()
        });

        await feedback.save();
        
        // Here you could add logic to update your keyword weights based on feedback
        // For example:
        // if (Math.abs(actualSentiment - predictedSentiment) > 0.5) {
        //   await this.adjustModel(text, actualSentiment);
        // }
    }

    // Optional method to adjust keyword weights
    static async adjustModel(text, actualSentiment) {
        // Implement your model adjustment logic here
        // This would analyze the text and update keyword weights in your analyzer
    }
}

module.exports = SentimentAnalysis;