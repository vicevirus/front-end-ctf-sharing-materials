const express = require('express');
const { visitUrl } = require('./bot');
const app = express();
const port = 7272;

// Added super strong sanitization <3
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

// Main page
app.get('/', (req, res) => {

  // The true real flag is only available on challenge server
  let realFlag = "cyberskillslvlup{REALFAKEFLAG}";
  let fakeFlag = "cyberskillslvlup{FAKEFAKEFLAG}"
  let flag = "";

  // If user connects from outside, show the fake flag. Else, show the real flag :D
  const remoteIP = req.socket.remoteAddress;
  if (remoteIP === '::ffff:127.0.0.1' || remoteIP === '::1' || remoteIP === '127.0.0.1') {
    flag = realFlag;
  } else {
    flag = fakeFlag;
  }

  let name = req.query.name; // Get user input from query string

  // Super strong sanitizer, no XSS allowed sry, kind of overkill here tbh ><
  name = DOMPurify.sanitize(name, { FORCE_BODY: true });

  if (name) {
    res.send(`Hello, ${name}!` +
      `<br><br> Uh.. the flag is here, but only the bot is able to see the real one <br> 
      <input id="flag" value="${flag}"> <br><br> <a href="/report">Report a payload</a>`);
  } else {
    res.send('Please give me your name? <br><br> /?name=yourname');
  }
});

// Report endpoint
app.get('/report', async (req, res) => {
  const payload = req.query.payload;
  if (!payload) {
    res.send('<h1>Report here :3</h1><form method="get"><input type="text" name="payload" placeholder="Enter payload"><button type="submit">Report</button></form>');
  } else {
    const url = `http://localhost:${port}/?name=${encodeURIComponent(payload)}`;
    const result = await visitUrl(url);
    if (result.success) {
      res.send(result.message);
    } else {
      res.status(500).send(result.message);
    }
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
