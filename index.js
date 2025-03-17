// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // Get all of the timestamps for the first 100 articles
  let timestamps = [];

  const fetchNewTimestamps = async () => {
    const locator = page.locator('.age');
    const newTimestamps = await locator.evaluateAll(articles => articles.map(article => article.getAttribute('title')));
    if (timestamps.length < 90) {
      timestamps = timestamps.concat(newTimestamps);
    } else {
      timestamps = timestamps.concat(newTimestamps.slice(0, 100 - timestamps.length))
    };
  };

  await fetchNewTimestamps();

  while (timestamps.length < 100) {
    const moreButton = page.locator('a.morelink');
    await moreButton.click();
    await page.waitForTimeout(1000);
    await fetchNewTimestamps();
  };

  console.log(timestamps.length)

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
