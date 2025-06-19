// server/utils/demandCalculator.js

class DemandCalculator {
    /**
     * Calculates market share based on price difference
     */
    static calculateMarketShare(yourPrice, avgCompetitorPrice, currentShare) {
        const priceDifference = avgCompetitorPrice - yourPrice;
        const priceRatio = yourPrice / avgCompetitorPrice;
        
        // Calculate elasticity effect (simplified)
        const elasticity = 1.5; // Assumed price elasticity
        const shareChange = (priceDifference / avgCompetitorPrice) * elasticity * 10;
        
        // Apply change with some inertia
        const newShare = currentShare + shareChange;
        
        // Keep within reasonable bounds
        return Math.max(5, Math.min(95, newShare));
    }

    /**
     * Calculates how attractive a price is compared to competitors
     */
    static calculatePriceAttractiveness(price, avgCompetitorPrice) {
        const priceRatio = price / avgCompetitorPrice;
        
        // Sigmoid function to map to 0-1 range
        return 1 / (1 + Math.exp(3 * (priceRatio - 0.9)));
    }

    /**
     * Estimates demand curve
     */
    static estimateDemand(price, baseDemand, elasticity = -1.2) {
        return baseDemand * Math.pow(price / baseDemand, elasticity);
    }
}

module.exports = DemandCalculator;