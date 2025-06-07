const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 🔐 Change this to your secure admin password
const ADMIN_PASSWORD = 'yourStrongPassword123';

// 📁 Directory to store images
const IMAGE_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR);

// 🧠 Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname));
app.use('/images', express.static(IMAGE_DIR));

// 🖼️ Handle image upload
app.post('/upload', (req, res) => {
  const imageData = req.body.image;
  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
  const filename = `img_${Date.now()}.png`;

  fs.writeFile(path.join(IMAGE_DIR, filename), base64Data, 'base64', (err) => {
    if (err) {
      console.error('Failed to save image:', err);
      return res.status(500).send('Failed to save image');
    }
    res.send('Image saved successfully');
  });
});

// 🔐 Admin password check
app.post('/verify-password', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password' });
  }
});

// 🖼️ Return list of image filenames
app.get('/images-list', (req, res) => {
  fs.readdir(IMAGE_DIR, (err, files) => {
    if (err) {
      console.error('Failed to list images:', err);
      return res.status(500).json({ error: 'Could not read image directory' });
    }
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));
    res.json(imageFiles);
  });
});

// 📋 Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
