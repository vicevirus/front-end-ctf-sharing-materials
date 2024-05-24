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
        
        const cookie = {
            'name': 'flag',
            'value': 'cyberskillslvlup{fake_flag_part1',
            'domain': 'localhost',
        };
        
        await page.setCookie(cookie);
        await page.goto(url, { waitUntil: 'networkidle2' });

        await new Promise(resolve => setTimeout(resolve, 2000));

        await browser.close();

        return { success: true, message: 'URL Visited! Please wait for awhile' };
    } catch (error) {
        return { success: false, message: 'Error visiting URL :(' };
    }
}

module.exports = { visitUrl };
