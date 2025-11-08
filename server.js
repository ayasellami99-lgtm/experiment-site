// server.js
const express = require('express');
const path = require('path');
const app = express();

// Serve all files in the project root (HTML, JS, CSS, videos, etc.)
app.use(express.static(path.join(__dirname, '/')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Use environment PORT (for Render) or 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
