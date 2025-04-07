import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local'
    },
    email: {
      type: String,
      unique: true,
      required: true,
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

userSchema.pre('deleteOne', { document: true }, async function(next) {
  await mongoose.model('Note').deleteMany({ createdBy: this._id });
  await mongoose.model('RefreshToken').deleteMany({ userId: this._id });
  next();
});

const User = mongoose.model("User", userSchema);

export default User;