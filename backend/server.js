import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import winston from 'winston';
import expressWinston from 'express-winston';

// Import Routes
import sessionRoutes from './routes/session.routes.js';
import branchRoutes from './routes/branch.routes.js';
import insuranceTypeRoutes from './routes/insuranceType.routes.js';
import userRouter from './routes/userRoutes.js';
import roleRouter from './routes/roleRouters.js';
import complaintsRoutes from './routes/complaints.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import feedbackInviteRoutes from './routes/feedbackInvite.routes.js';



// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS middleware
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || "devsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60
  }
}));

// ============================
// Logging Middleware
// ============================

// Morgan for concise request logging
app.use(morgan('dev'));

// Express-Winston for structured logging
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  meta: true,               // log metadata about request
  msg: "HTTP {{req.method}} {{req.url}}", // custom message
  expressFormat: true,      // default format like :method :url :status
  colorize: true
}));

// ============================
// Routes
// ============================
app.use('/api/sessions', sessionRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/insurance-types', insuranceTypeRoutes);
app.use('/users', userRouter);
app.use('/roles', roleRouter);
app.use('/api/complaints', complaintsRoutes);
// Feedback endpoints are used by frontend at /feedback
app.use('/feedback', feedbackRoutes);
app.use('/api/feedback', feedbackInviteRoutes); // exposes /api/feedback/session/:id/invite and /api/feedback/submit

// Test route
app.get("/", (req, res) => {
  res.send("ServSync API is running ✅");
});

// ============================
// Start Server
// ============================
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

startServer();
