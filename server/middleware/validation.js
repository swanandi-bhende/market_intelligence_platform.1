// server/middleware/validation.js

exports.validateSentimentRequest = (req, res, next) => {
    if (req.method === 'POST' && req.path.includes('/sentiments')) {
        if (!req.body.text && !req.body.texts) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: text or texts'
            });
        }

        if (req.body.method && !['keyword', 'hybrid', 'emoji'].includes(req.body.method)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid method. Must be one of: keyword, hybrid, emoji'
            });
        }
    }
    next();
};
// server/middleware/validation.js

exports.validateSimulationRequest = (req, res, next) => {
    if (req.method === 'POST' && req.path.includes('/simulations')) {
        // Price war validation
        if (req.path.endsWith('/price-war')) {
            if (typeof req.body.basePrice !== 'number' || req.body.basePrice <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid basePrice. Must be a positive number'
                });
            }

            if (!Array.isArray(req.body.competitors) || req.body.competitors.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'At least one competitor is required'
                });
            }
        }

        // New product validation
        if (req.path.endsWith('/new-product')) {
            if (typeof req.body.productCost !== 'number' || req.body.productCost <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid productCost. Must be a positive number'
                });
            }

            if (!Array.isArray(req.body.priceOptions) || req.body.priceOptions.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'At least one price option is required'
                });
            }
        }

        // Promotion validation
        if (req.path.endsWith('/promotion')) {
            if (typeof req.body.basePrice !== 'number' || req.body.basePrice <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid basePrice. Must be a positive number'
                });
            }

            if (typeof req.body.promotionDiscount !== 'number' || 
                req.body.promotionDiscount < 0 || req.body.promotionDiscount > 100) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid promotionDiscount. Must be between 0 and 100'
                });
            }
        }
    }
    next();
};