// server/services/simulationService.js

const DemandCalculator = require('../utils/demandCalculator');
const CompetitorResponse = require('../utils/competitorResponse');

class SimulationService {
    /**
     * Simulates a price war scenario
     */
    static async simulatePriceWar(basePrice, competitors, duration = 4, strategy = 'moderate') {
        const weeks = [];
        let currentPrice = basePrice;
        let marketShare = 100 / (competitors.length + 1); // Equal initial share
        
        // Determine strategy parameters
        const strategyParams = this.getStrategyParams(strategy);
        
        for (let week = 1; week <= duration; week++) {
            const weekResult = { week, yourPrice: currentPrice, competitors: [] };
            
            // Calculate your new price (aggressive, moderate, or defensive)
            const priceChange = this.calculatePriceChange(week, strategyParams);
            currentPrice = Math.max(currentPrice * (1 - priceChange), strategyParams.minPrice);
            
            // Simulate each competitor's response
            let totalCompetitorPrice = 0;
            for (const comp of competitors) {
                const response = CompetitorResponse.getPriceWarResponse(
                    comp.currentPrice, 
                    comp.aggression, 
                    priceChange
                );
                weekResult.competitors.push({
                    name: comp.name,
                    price: response.newPrice
                });
                totalCompetitorPrice += response.newPrice;
                comp.currentPrice = response.newPrice; // Update for next week
            }
            
            // Calculate market share changes
            const avgCompetitorPrice = totalCompetitorPrice / competitors.length;
            marketShare = DemandCalculator.calculateMarketShare(currentPrice, avgCompetitorPrice, marketShare);
            
            // Calculate profit (simplified)
            const profit = this.calculateProfit(currentPrice, marketShare);
            
            weekResult.marketShare = marketShare;
            weekResult.profit = profit;
            weeks.push(weekResult);
        }
        
        return {
            scenario: 'price-war',
            weeks,
            summary: {
                finalMarketShare: weeks[weeks.length - 1].marketShare,
                totalProfit: weeks.reduce((sum, week) => sum + week.profit, 0),
                priceReduction: ((basePrice - currentPrice) / basePrice) * 100
            }
        };
    }

    /**
     * Simulates a new product launch scenario
     */
    static async simulateNewProductLaunch(productCost, competitors, priceOptions, marketSize = 10000) {
        const scenarios = [];
        
        // Analyze competitor products
        const competitorPrices = competitors.flatMap(c => 
            c.similarProducts.map(p => p.price)
        );
        const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
        
        // Evaluate each price option
        for (const price of priceOptions) {
            // Calculate price attractiveness (0-1 scale)
            const priceAttractiveness = DemandCalculator.calculatePriceAttractiveness(
                price, 
                avgCompetitorPrice
            );
            
            // Estimate sales based on attractiveness
            const estimatedSales = Math.round(
                marketSize * 
                priceAttractiveness * 
                (1 - (competitors.length * 0.1)) // Competition penalty
            );
            
            const revenue = price * estimatedSales;
            const profit = (price - productCost) * estimatedSales;
            const marketShare = (estimatedSales / marketSize) * 100;
            
            // Simplified break-even calculation
            const fixedCosts = marketSize * 0.2; // Example fixed costs
            const breakEvenDays = Math.ceil(fixedCosts / (profit / 30));
            
            scenarios.push({
                price,
                estimatedSales,
                revenue,
                profit,
                marketShare,
                breakEvenDays
            });
        }
        
        // Find the recommended price (max profit)
        const recommendation = scenarios.reduce((best, current) => 
            current.profit > best.profit ? current : best
        );
        
        return {
            scenario: 'new-product',
            scenarios,
            recommendation: {
                bestPrice: recommendation.price,
                expectedProfit: recommendation.profit,
                expectedMarketShare: recommendation.marketShare
            }
        };
    }

    /**
     * Simulates promotion impact
     */
    static async simulatePromotionImpact(
        basePrice, 
        discountPercent, 
        duration = 7, 
        historicalSales, 
        competitorResponse = 'none'
    ) {
        const dailyResults = [];
        const discountedPrice = basePrice * (1 - discountPercent / 100);
        
        // Calculate baseline sales (average of historical sales)
        const baselineSales = historicalSales && historicalSales.length > 0 ?
            historicalSales.reduce((a, b) => a + b, 0) / historicalSales.length :
            100; // Default if no historical data
        
        let totalRevenue = 0;
        let totalProfit = 0;
        let totalNewCustomers = 0;
        
        for (let day = 1; day <= duration; day++) {
            // Calculate demand multiplier based on promotion
            const demandMultiplier = this.calculateDemandMultiplier(day, duration, discountPercent);
            
            // Calculate competitor impact
            const competitorImpact = CompetitorResponse.getPromotionImpact(competitorResponse, day);
            
            // Calculate estimated sales
            const estimatedSales = Math.round(
                baselineSales * 
                demandMultiplier * 
                (1 - competitorImpact)
            );
            
            // Estimate 20% of increased sales are new customers
            const newCustomers = Math.round((estimatedSales - baselineSales) * 0.2);
            
            const revenue = discountedPrice * estimatedSales;
            const profit = (discountedPrice * 0.7) * estimatedSales; // Assuming 30% margin
            
            dailyResults.push({
                day,
                discountedPrice,
                estimatedSales,
                revenue,
                profit,
                newCustomers: Math.max(0, newCustomers)
            });
            
            totalRevenue += revenue;
            totalProfit += profit;
            totalNewCustomers += newCustomers;
        }
        
        // Calculate baseline metrics for comparison
        const baselineRevenue = basePrice * baselineSales * duration;
        const baselineProfit = (basePrice * 0.7) * baselineSales * duration;
        
        return {
            scenario: 'promotion',
            dailyResults,
            summary: {
                totalRevenue,
                totalProfit,
                totalNewCustomers,
                revenueChange: ((totalRevenue - baselineRevenue) / baselineRevenue) * 100,
                profitChange: ((totalProfit - baselineProfit) / baselineProfit) * 100
            }
        };
    }

    // Helper methods
    static getStrategyParams(strategy) {
        const strategies = {
            aggressive: {
                initialChange: 0.15,
                maxChange: 0.25,
                minPrice: 0.5 // Can't go below 50% of original
            },
            moderate: {
                initialChange: 0.1,
                maxChange: 0.15,
                minPrice: 0.7
            },
            defensive: {
                initialChange: 0.05,
                maxChange: 0.1,
                minPrice: 0.8
            }
        };
        return strategies[strategy] || strategies.moderate;
    }

    static calculatePriceChange(week, strategy) {
        // Reduce aggression as weeks progress
        const weekFactor = 1 / Math.sqrt(week);
        return Math.min(
            strategy.initialChange * weekFactor,
            strategy.maxChange
        );
    }

    static calculateProfit(price, marketShare) {
        // Simplified profit calculation
        const unitCost = price * 0.6; // Assume 40% margin
        const marketSize = 10000; // Arbitrary market size
        const unitsSold = (marketShare / 100) * marketSize;
        return (price - unitCost) * unitsSold;
    }

    static calculateDemandMultiplier(day, duration, discountPercent) {
        // Peak in middle of promotion
        const progress = day / duration;
        const peakFactor = 1 + Math.sin(progress * Math.PI) * 0.5;
        
        // Base multiplier based on discount size
        const discountFactor = 1 + (discountPercent / 100) * 2;
        
        return peakFactor * discountFactor;
    }
}

module.exports = SimulationService;