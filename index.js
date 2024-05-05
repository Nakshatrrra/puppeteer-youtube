const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors());

app.post('/search', async (req, res) => {
    const term = req.body.term;
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(searchUrl);

    await page.waitForSelector('ytd-video-renderer');

    const searchResults = await page.evaluate(() => {
        const results = [];
        const items = document.querySelectorAll('ytd-video-renderer');

        items.forEach(item => {
            const title = item.querySelector('#video-title').innerText.trim();
            const url = item.querySelector('#video-title').getAttribute('href');
            const thumbnail = item.querySelector('#img').getAttribute('src');
            results.push({ title, url, thumbnail });
        });

        return results;
    });

    await browser.close();

    res.json(searchResults);
});

app.listen(3000, () => console.log('Server is running on port 3000'));
