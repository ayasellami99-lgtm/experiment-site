const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Storage for videos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- Handle webcam uploads ---
app.post('/upload', upload.single('video'), (req, res) => {
  console.log('Video received:', req.file.filename);
  res.json({ status: 'ok', file: req.file.filename });
});

// --- Handle responses (e.g., questionnaire/rating) ---
app.post('/save-responses', (req, res) => {
  const data = req.body;
  const line = JSON.stringify(data) + '\n';
  fs.appendFile('uploads/responses.txt', line, err => {
    if (err) return res.status(500).send('Error saving responses');
    console.log('Response saved:', data);
    res.send({ status: 'ok' });
  });
});

// --- Serve page ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
