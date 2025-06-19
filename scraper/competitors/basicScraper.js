const axios = require('axios');
const cheerio = require('cheerio');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

class BasicScraper {
  constructor(competitorId, url) {
    this.competitorId = competitorId;
    this.url = url;
    this.data = {};
  }

  async scrape() {
    try {
      console.log(`Starting scrape for ${this.url}`);
      
      // Fetch the page
      const response = await axios.get(this.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      // Load HTML into Cheerio
      const $ = cheerio.load(response.data);
      
      // Extract basic information - this will vary based on the website structure
      this.data.name = $('h1').first().text().trim();
      
      // Attempt to find price - this is very site-specific
      this.data.price = this.extractPrice($);
      
      // Extract other relevant data
      this.data.products = [];
      
      $('.product').each((i, el) => {
        const product = {
          name: $(el).find('.product-name').text().trim(),
          price: $(el).find('.product-price').text().trim(),
        };
        this.data.products.push(product);
      });
      
      console.log(`Completed scrape for ${this.url}`);
      return this.data;
    } catch (error) {
      console.error(`Error scraping ${this.url}:`, error.message);
      throw error;
    }
  }
  
  extractPrice($) {
    // Try different selectors to find price
    const priceSelectors = [
      '.price', '#price', '[itemprop="price"]', 
      '.product-price', '.price-value'
    ];
    
    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        // Extract numeric value from price string
        const priceMatch = priceText.match(/(\d+\.?\d*)/);
        if (priceMatch) {
          return parseFloat(priceMatch[0]);
        }
      }
    }
    
    return null;
  }
}

// Worker thread implementation
if (!isMainThread) {
  const scraper = new BasicScraper(workerData.competitorId, workerData.url);
  scraper.scrape()
    .then(data => parentPort.postMessage({ success: true, data }))
    .catch(error => parentPort.postMessage({ success: false, error: error.message }));
}

module.exports = BasicScraper;