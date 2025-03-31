import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.model.js";
import crypto from "crypto";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m", 
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 60 * 1000, 
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development"
  });

  return token;
};

export const generateRefreshToken = async (userId, req) => {
  // Generate a random token
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); 

  // Store in database
  await RefreshToken.create({
    token,
    userId,
    deviceInfo: req.headers['user-agent'] || 'Unknown device',
    ipAddress: req.ip,
    expiresAt
  });

  return token;
};