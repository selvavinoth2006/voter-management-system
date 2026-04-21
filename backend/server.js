const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const voterRoutes = require('./routes/voterRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');
const electionRoutes = require('./routes/electionRoutes');
const resultRoutes = require('./routes/resultRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://voter-management-sys.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/voters', voterRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/results', resultRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Voter Management System API is running');
});

// Initialize DB and Start Server
const startServer = async () => {
  try {
    await initDb();
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();

module.exports = app;
