// server/utils/scraping.js

const path = require('path');
const { Worker } = require('worker_threads');

function scrapeCompetitorData(url, competitorConfig = {}) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'scraperWorker.js'), {
      workerData: { url, competitorConfig },
    });

    worker.on('message', (data) => {
      if (data.error) {
        reject(new Error(data.error));
      } else {
        resolve(data);
      }
    });

    worker.on('error', (error) => {
      reject(error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

module.exports = { scrapeCompetitorData };
