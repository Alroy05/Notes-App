import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { connectDB } from "./lib/db.js";
import authRoutes from './routes/auth.route.js';
import noteRoutes from './routes/notes.route.js';
import userRoutes from "./routes/user.route.js";
import "./lib/oauthStrategies.js"; // Ensure this file is created and contains the OAuth strategies

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
})