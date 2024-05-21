const express = require('express');
const { visitUrl } = require('./bot');
const app = express();
const port = 7555;

app.use((req, res, next) => {
  // you can never get the cookie out from here >:)
  res.set('Content-Security-Policy', "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; navigate-to 'none';");
  next();
});

// Main page
app.get('/', (req, res) => {
  let name = req.query.name; // Get user input from query string
  if (name) {
    res.send(`Hello, ${name}! <br> <a href="/report">Report a URL</a>`);
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
