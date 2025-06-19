// server/routes/simulations.js

const express = require('express');
const router = express.Router();
const SimulationService = require('../services/simulationService');
const { validateSimulationRequest } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Market Simulations
 *   description: Market scenario simulation endpoints
 */

/**
 * @swagger
 * /api/simulations/price-war:
 *   post:
 *     summary: Simulate a price war scenario
 *     tags: [Market Simulations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - basePrice
 *               - competitors
 *             properties:
 *               basePrice:
 *                 type: number
 *                 description: Current product price
 *                 example: 100
 *               competitors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     currentPrice:
 *                       type: number
 *                     aggression:
 *                       type: number
 *                       description: Competitor's likely response (0-1)
 *               duration:
 *                 type: integer
 *                 description: Weeks to simulate
 *                 default: 4
 *               strategy:
 *                 type: string
 *                 enum: [aggressive, moderate, defensive]
 *                 default: moderate
 *     responses:
 *       200:
 *         description: Price war simulation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 scenario:
 *                   type: string
 *                 weeks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       week:
 *                         type: integer
 *                       yourPrice:
 *                         type: number
 *                       competitors:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             price:
 *                               type: number
 *                       marketShare:
 *                         type: number
 *                       profit:
 *                         type: number
 *                 summary:
 *                   type: object
 *                   properties:
 *                     finalMarketShare:
 *                       type: number
 *                     totalProfit:
 *                       type: number
 *                     priceReduction:
 *                       type: number
 *       400:
 *         description: Invalid input
 */
router.post('/price-war', validateSimulationRequest, async (req, res) => {
    try {
        const { basePrice, competitors, duration = 4, strategy = 'moderate' } = req.body;

        const results = await SimulationService.simulatePriceWar(
            basePrice, 
            competitors, 
            duration, 
            strategy
        );

        res.json({
            success: true,
            ...results
        });
    } catch (error) {
        console.error('Price war simulation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run price war simulation',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/simulations/new-product:
 *   post:
 *     summary: Simulate new product launch
 *     tags: [Market Simulations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productCost
 *               - competitors
 *             properties:
 *               productCost:
 *                 type: number
 *                 description: Manufacturing cost per unit
 *                 example: 50
 *               competitors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     similarProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *               priceOptions:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Price points to evaluate
 *                 example: [79, 89, 99]
 *               marketSize:
 *                 type: number
 *                 default: 10000
 *     responses:
 *       200:
 *         description: New product simulation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 scenarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       price:
 *                         type: number
 *                       estimatedSales:
 *                         type: number
 *                       revenue:
 *                         type: number
 *                       profit:
 *                         type: number
 *                       marketShare:
 *                         type: number
 *                       breakEvenDays:
 *                         type: number
 *                 recommendation:
 *                   type: object
 *                   properties:
 *                     bestPrice:
 *                       type: number
 *                     expectedProfit:
 *                       type: number
 *                     expectedMarketShare:
 *                       type: number
 *       400:
 *         description: Invalid input
 */
router.post('/new-product', validateSimulationRequest, async (req, res) => {
    try {
        const { productCost, competitors, priceOptions, marketSize = 10000 } = req.body;

        const results = await SimulationService.simulateNewProductLaunch(
            productCost,
            competitors,
            priceOptions,
            marketSize
        );

        res.json({
            success: true,
            ...results
        });
    } catch (error) {
        console.error('New product simulation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run new product simulation',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/simulations/promotion:
 *   post:
 *     summary: Simulate promotion impact
 *     tags: [Market Simulations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - basePrice
 *               - promotionDiscount
 *             properties:
 *               basePrice:
 *                 type: number
 *                 example: 100
 *               promotionDiscount:
 *                 type: number
 *                 description: Percentage discount (0-100)
 *                 example: 20
 *               duration:
 *                 type: integer
 *                 description: Days of promotion
 *                 default: 7
 *               historicalSales:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Past 30 days of sales data
 *               competitorResponse:
 *                 type: string
 *                 enum: [none, match, undercut]
 *                 default: none
 *     responses:
 *       200:
 *         description: Promotion simulation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 dailyResults:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                       discountedPrice:
 *                         type: number
 *                       estimatedSales:
 *                         type: number
 *                       revenue:
 *                         type: number
 *                       profit:
 *                         type: number
 *                       newCustomers:
 *                         type: number
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                     totalProfit:
 *                       type: number
 *                     totalNewCustomers:
 *                       type: number
 *                     revenueChange:
 *                       type: number
 *                     profitChange:
 *                       type: number
 *       400:
 *         description: Invalid input
 */
router.post('/promotion', validateSimulationRequest, async (req, res) => {
    try {
        const { 
            basePrice, 
            promotionDiscount, 
            duration = 7, 
            historicalSales, 
            competitorResponse = 'none' 
        } = req.body;

        const results = await SimulationService.simulatePromotionImpact(
            basePrice,
            promotionDiscount,
            duration,
            historicalSales,
            competitorResponse
        );

        res.json({
            success: true,
            ...results
        });
    } catch (error) {
        console.error('Promotion simulation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run promotion simulation',
            details: error.message
        });
    }
});

module.exports = router;