// server/utils/keywordAnalyzer.js

const keywordWeights = {
    en: {
        positive: [
            { word: 'good', weight: 0.7 },
            { word: 'great', weight: 0.9 },
            { word: 'excellent', weight: 1.0 },
            { word: 'happy', weight: 0.8 }
        ],
        negative: [
            { word: 'bad', weight: -0.7 },
            { word: 'terrible', weight: -1.0 },
            { word: 'awful', weight: -0.9 },
            { word: 'angry', weight: -0.8 }
        ]
    },
    // Add other languages as needed
};

class KeywordAnalyzer {
    static analyze(text, language = 'en') {
        if (!keywordWeights[language]) {
            throw new Error(`Unsupported language: ${language}`);
        }

        const words = text.toLowerCase().split(/\s+/);
        let sentiment = 0;
        const matchedKeywords = [];

        // Check each word against our keyword lists
        words.forEach(word => {
            // Remove punctuation from word
            const cleanWord = word.replace(/[^\w\s]|_/g, '');

            // Check positive keywords
            const positiveMatch = keywordWeights[language].positive.find(k => k.word === cleanWord);
            if (positiveMatch) {
                sentiment += positiveMatch.weight;
                matchedKeywords.push({
                    word: cleanWord,
                    sentiment: 'positive',
                    weight: positiveMatch.weight
                });
                return;
            }

            // Check negative keywords
            const negativeMatch = keywordWeights[language].negative.find(k => k.word === cleanWord);
            if (negativeMatch) {
                sentiment += negativeMatch.weight;
                matchedKeywords.push({
                    word: cleanWord,
                    sentiment: 'negative',
                    weight: negativeMatch.weight
                });
            }
        });

        // Normalize sentiment score (-1 to 1)
        const normalized = (sentiment + 1) / 2;

        return {
            sentiment: Math.max(-1, Math.min(1, sentiment)), // Clamp between -1 and 1
            normalized: Math.max(0, Math.min(1, normalized)), // Clamp between 0 and 1
            keywords: matchedKeywords,
            method: 'keyword'
        };
    }
}

module.exports = KeywordAnalyzer;