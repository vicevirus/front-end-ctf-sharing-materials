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
                // Turned on experimental features so that navigate-to works and you cannot use location() redirect to steal the cookie :D
                "--enable-experimental-web-platform-features" 
            ]
        });
            
        const page = await browser.newPage();
        
        const cookie = {
            'name': 'flag',
            'value': 'cyberskillslvlup{fake_flag}',
            'domain': 'localhost',
        };
        
        await page.setCookie(cookie);
        await page.goto(url, { waitUntil: 'networkidle2' });

        await new Promise(resolve => setTimeout(resolve, 2000));


        return { success: true, message: 'URL Visited!' };
    } catch (error) {
        return { success: false, message: 'Error visiting URL :(' };
    }
}

module.exports = { visitUrl };
