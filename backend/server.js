import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'; // Import your DB connection logic
import cors from 'cors';
import morgan from 'morgan';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON requests
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // For logging HTTP requests

// Routes
import insuranceTypeRoutes from './routes/insuranceType.routes.js';
import branchRoutes from './routes/branch.routes.js';
import sessionRoutes from './routes/session.routes.js';

app.use('/api/insurance-types', insuranceTypeRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/sessions', sessionRoutes);

// Connect to the database and start the server
const startServer = async () => {
  try {
    await connectDB();  // Connect to the database
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit if the connection fails
  }
};

startServer(); // Start the server
