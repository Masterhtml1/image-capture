const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const IMAGE_DIR = path.join(__dirname, 'images');

if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname));

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
