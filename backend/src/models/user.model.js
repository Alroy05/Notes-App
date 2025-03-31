import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6
    },
    profilePic: {
      type: String,
      default: ""
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    activeSessions: [{
      deviceInfo: String,
      ipAddress: String,
      lastActive: Date
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;