// server/utils/competitorResponse.js

class CompetitorResponse {
    /**
     * Simulates competitor response in price war
     */
    static getPriceWarResponse(currentPrice, aggression, yourPriceChange) {
        // aggression: 0-1 (how aggressively they respond)
        // yourPriceChange: your percentage price change
        
        // Base response based on aggression
        let responseChange = yourPriceChange * (0.5 + aggression / 2);
        
        // Add some randomness (±20%)
        responseChange *= 0.8 + Math.random() * 0.4;
        
        // Never increase price during war
        responseChange = Math.min(responseChange, 0.3); // Cap at 30% decrease
        
        const newPrice = currentPrice * (1 + responseChange);
        
        return {
            newPrice,
            changePercent: responseChange * 100
        };
    }

    /**
     * Simulates competitor response to your promotion
     */
    static getPromotionImpact(responseType, day) {
        // Returns 0-1 indicating how much competitor response reduces your benefit
        switch (responseType) {
            case 'match':
                // Gradually matches your promotion over time
                return Math.min(0.7, day * 0.15);
            case 'undercut':
                // More aggressive response
                return Math.min(0.9, day * 0.2);
            default:
                return 0;
        }
    }

    /**
     * Simulates competitor response to new product launch
     */
    static getNewProductResponse(yourPrice, competitorPrices) {
        const avgPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
        
        if (yourPrice < avgPrice * 0.9) {
            // If you're significantly cheaper, 60% chance they'll lower prices
            return Math.random() < 0.6 ? 'price-cut' : 'none';
        } else if (yourPrice > avgPrice * 1.1) {
            // If you're more expensive, they might ignore or promote
            return Math.random() < 0.3 ? 'promote' : 'none';
        }
        return 'none';
    }
}

module.exports = CompetitorResponse;