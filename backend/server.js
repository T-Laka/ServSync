import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';  // Assuming you have the database connection logic here

import sessionRoutes from './routes/session.route.js';
import branchRoutes from './routes/branch.routes.js';
import insuranceTypeRoutes from './routes/insuranceType.routes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/insurance-types', insuranceTypeRoutes);

// Connect to the database and then start the server
const startServer = async () => {
  try {
    await connectDB();  // Connect to the database first
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);  // Exit the process if the database connection fails
  }
};

startServer();  // Call the function to start the server
