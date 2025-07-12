const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Item = require('./models/Item');
const User = require('./models/User');
const Swap = require('./models/Swap');

const authRoutes = require('./routes/AuthRoutes');
const itemRoutes = require('./routes/ItemRoutes');
const swapRoutes = require('./routes/SwapRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    await Item.createIndexes({ owner: 1, status: 1 });
    await User.createIndexes({ email: 1 }, { unique: true });
    await Swap.createIndexes({ requester: 1, recipient: 1 });
    console.log('Database indexes created');
  } catch (err) {
    console.error('Index creation error:', err);
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  
  Item.createIndexes({ owner: 1, status: 1 });
  User.createIndexes({ email: 1 }, { unique: true });
  Swap.createIndexes({ requester: 1, recipient: 1 });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/swaps', swapRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const { errorHandler } = require('./middleware/errorHandler');

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));