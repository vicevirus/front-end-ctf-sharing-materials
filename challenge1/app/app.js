const express = require('express');
const { visitUrl } = require('./bot');
const app = express();
const port = 7832;

// Main page
app.get('/', (req, res) => {
  let name = req.query.name; // Get user input from query string
  console.log(name);

  if (name) {
    // Super strong filter >:) Filter out spaces, single quotes, double quotes, and <script> tags
    name = name.replace(/['"`]/g, '')
          .replace(/<\s*s\s*c\s*r\s*i\s*p\s*t\s*.*?>.*?<\s*\/\s*s\s*c\s*r\s*i\s*p\s*t\s*>/mi, '')
          .replace(/\s+/g, '');

    
    res.send(`Hello, ${name}! <br> <a href="/report">Report here</a>`);
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

// Secret endpoint which you could never access :)
app.get('/secret', async (req, res) => {
  const remoteIP = req.socket.remoteAddress;
  if (remoteIP === '::ffff:127.0.0.1' || remoteIP === '::1' || remoteIP === '127.0.0.1') {
    return res.send(`fake_flag_part2}`);
  } else {
    return res.status(403).send(`err.. nope. You are not allowed to see this :<`);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
