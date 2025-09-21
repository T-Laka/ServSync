import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';  // Assuming you have the database connection logic here
import cors from 'cors';
import session from 'express-session';

// Import Routes
import sessionRoutes from './routes/session.route.js';  // Session routes
import branchRoutes from './routes/branch.routes.js';  // Branch routes
import insuranceTypeRoutes from './routes/insuranceType.routes.js';  // Insurance Type routes
import userRouter from './routes/userRoutes.js';  // User management routes (friend's code)
import roleRouter from './routes/roleRouters.js';  // Role management routes (friend's code)

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// CORS middleware to allow cross-origin requests
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173"; // Update based on your frontend setup

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true // Allow credentials like cookies and session data
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Session management middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "devsecret",  // Secret key for session
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === 'production', // Set this to true if using HTTPS in production
    maxAge: 1000 * 60 * 60 // Session expiration (1 hour)
  }
}));

// Routes
app.use('/api/sessions', sessionRoutes);  // Session routes (for login, logout, etc.)
app.use('/api/branches', branchRoutes);  // Branch management routes
app.use('/api/insurance-types', insuranceTypeRoutes);  // Insurance type management
app.use('/users', userRouter);  // User management routes (login, register)
app.use('/roles', roleRouter);  // Role management routes (admin, user roles)

// Basic route to check if API is running
app.get("/", (req, res) => {
  res.send("ServSync API is running ✅");
});

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();  // Connect to the database
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);  // Exit the process if the database connection fails
  }
};

startServer();  // Start the server
