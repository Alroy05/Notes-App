import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceInfo: String,
  ipAddress: String,
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;