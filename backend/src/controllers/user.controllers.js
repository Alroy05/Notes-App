import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { generateToken } from "../lib/utils.js";

export const getProfile = async (req, res) => {
  try {
    const user = req.user.toObject();
    
    delete user.password;
    delete user.verificationToken;
    delete user.verificationTokenExpires;
    delete user.activeSessions;
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic } = req.body;
    
    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, profilePic },
      { new: true, runValidators: true }
    ).select("-password -verificationToken -verificationTokenExpires");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    if (!validator.isStrongPassword(newPassword, { 
      minLength: 6, 
      minLowercase: 1, 
      minUppercase: 1, 
      minNumbers: 1 
    })) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number"
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    await user.deleteOne();

    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAccount:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActiveSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("activeSessions");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.activeSessions);
  } catch (error) {
    console.error("Error in getActiveSessions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.activeSessions = user.activeSessions.filter(
      session => session._id.toString() !== sessionId
    );

    await user.save();

    res.status(200).json({ message: "Session revoked successfully" });
  } catch (error) {
    console.error("Error in revokeSession:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};