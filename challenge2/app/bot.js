const puppeteer = require('puppeteer');

async function visitUrl(url) {
    try {
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            return { success: false, message: 'Wrong URL format. Use http or https pls?' };
        }

        const browser = await puppeteer.launch({ 
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--js-flags=--noexpose_wasm,--jitless",
            ],
        });

        const page = await browser.newPage();
        await page.setJavaScriptEnabled(false); // Disabled JavaScript lol
        
        await page.goto(url, { waitUntil: 'networkidle2' });

        await new Promise(resolve => setTimeout(resolve, 2000));

        await browser.close();

        return { success: true, message: 'URL Visited!' };
    } catch (error) {
        return { success: false, message: 'Error visiting URL :(' };
    }
}

module.exports = { visitUrl };
