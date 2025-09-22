const express = require('express');
const mongoose = require('mongoose');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// --- MongoDB Connection ---
// The connection string comes from the docker-compose.yml file.
// 'mongodb' is the service name of the MongoDB container.
const mongoURI = 'mongodb://mongodb:27017/devops-db';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Define a simple Schema and Model (optional, but good practice) ---
const itemSchema = new mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', itemSchema);

// Middleware to parse JSON
app.use(express.json());

// --- API Routes ---

// Root endpoint
app.get('/', (req, res) => {
  res.send('<h1>Node.js and MongoDB App</h1><p>Welcome! Try hitting the /items endpoint.</p>');
});

// Endpoint to get all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
});

// Endpoint to add a new item
app.post('/items', async (req, res) => {
  const newItem = new Item({
    name: req.body.name || 'Default Item'
  });

  try {
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Error adding item', error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
