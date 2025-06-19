// server/utils/emojiAnalyzer.js

const emojiWeights = {
    '😊': 0.8,    // Smiling face
    '😍': 1.0,    // Heart eyes
    '👍': 0.7,    // Thumbs up
    '😢': -0.8,   // Crying face
    '😠': -1.0,   // Angry face
    '👎': -0.7    // Thumbs down
};

class EmojiAnalyzer {
    static analyze(text) {
        const emojis = Array.from(text).filter(char => {
            const code = char.codePointAt(0).toString(16);
            return code.length >= 4; // Basic emoji detection
        });

        let sentiment = 0;
        const matchedEmojis = [];

        emojis.forEach(emoji => {
            if (emojiWeights.hasOwnProperty(emoji)) {
                sentiment += emojiWeights[emoji];
                matchedEmojis.push({
                    emoji,
                    sentiment: emojiWeights[emoji] > 0 ? 'positive' : 'negative',
                    weight: emojiWeights[emoji]
                });
            }
        });

        // Normalize if we found any emojis
        if (emojis.length > 0) {
            sentiment = sentiment / emojis.length;
        }

        const normalized = (sentiment + 1) / 2;

        return {
            sentiment: Math.max(-1, Math.min(1, sentiment)),
            normalized: Math.max(0, Math.min(1, normalized)),
            keywords: matchedEmojis,
            method: 'emoji'
        };
    }
}

module.exports = EmojiAnalyzer;