// server/utils/scraperWorker.js

const { workerData, parentPort } = require('worker_threads');
const axios = require('axios');
const cheerio = require('cheerio');

if (!workerData) {
  parentPort.postMessage({ error: 'No workerData provided' });
  process.exit(1);
}

const { url, competitorConfig } = workerData;

(async () => {
  try {
    const axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    };

    const response = await axios.get(url, axiosConfig);
    const $ = cheerio.load(response.data);

    const result = {
      url,
      price: extractPrice($, competitorConfig?.priceSelectors),
      currency: extractCurrency($, competitorConfig?.currencySelectors),
      products: extractProducts($, competitorConfig?.productSelectors),
      sourceUrl: url,
    };

    parentPort.postMessage(result);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
})();

function extractPrice($, selectors = ['.price', '#price', '[itemprop="price"]']) {
  for (const selector of selectors) {
    const priceText = $(selector).first().text().trim();
    if (priceText) {
      const priceMatch = priceText.match(/(\d+[\.,]?\d*)/);
      if (priceMatch) {
        return parseFloat(priceMatch[0].replace(',', ''));
      }
    }
  }
  return null;
}

function extractCurrency($, selectors = ['.currency', '[itemprop="priceCurrency"]']) {
  for (const selector of selectors) {
    const currency = $(selector).first().text().trim().substring(0, 3);
    if (currency) return currency;
  }
  return 'USD'; // Default currency
}

function extractProducts($, selectors = ['.product', '.item']) {
  const products = [];
  $(selectors[0]).each((i, el) => {
    products.push({
      name: $(el).find('.name').text().trim() || $(el).find('h3').text().trim(),
      price: extractPrice($(el)),
    });
  });
  return products;
}
