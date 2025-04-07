import { generateToken, generateRefreshToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { sendVerificationEmail } from "../lib/email.js";
import crypto from "crypto";

const getDeviceInfo = (req) => {
  return req.headers['user-agent'] || 'Unknown device';
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isStrongPassword(password, { 
      minLength: 6, 
      minLowercase: 1, 
      minUppercase: 1, 
      minNumbers: 1 
    })) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 1);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      activeSessions: [{
        deviceInfo: getDeviceInfo(req),
        ipAddress: req.ip,
        lastActive: new Date()
      }]
    });

    await newUser.save();
    
    await sendVerificationEmail(email, verificationToken);

    const accessToken = generateToken(newUser._id, res);
    const refreshToken = await generateRefreshToken(newUser._id, req);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      isVerified: false,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  
  try {
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyEmail controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Email not verified. Please check your email for verification link."
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const deviceInfo = getDeviceInfo(req);
    const sessionIndex = user.activeSessions.findIndex(
      session => session.deviceInfo === deviceInfo
    );

    if (sessionIndex >= 0) {
      user.activeSessions[sessionIndex].lastActive = new Date();
      user.activeSessions[sessionIndex].ipAddress = req.ip;
    } else {
      user.activeSessions.push({
        deviceInfo,
        ipAddress: req.ip,
        lastActive: new Date()
      });
    }

    await user.save();

    const accessToken = generateToken(user._id, res);
    const refreshToken = await generateRefreshToken(user._id, req);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isVerified: user.isVerified,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    
    res.cookie("jwt", "", { maxAge: 0 });
    
    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
    }
    
    if (req.user) {
      const deviceInfo = getDeviceInfo(req);
      const user = await User.findById(req.user._id);
      
      user.activeSessions = user.activeSessions.filter(
        session => session.deviceInfo !== deviceInfo
      );
      
      await user.save();
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.findByIdAndDelete(storedToken._id);
      return res.status(403).json({ message: "Refresh token expired" });
    }

    const user = await User.findById(storedToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = generateToken(user._id, res);

    res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error("Error in refreshAccessToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req,res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in Auth Controller",error.message);
    res.status(500).json({ message: "Internal Server Error"});
  }
}

export const handleOAuthCallback = (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.error("OAuth Callback Error: User not found in request after passport auth.");
      throw new Error('Authentication failed, user profile not obtained.');
    }

    generateToken(req.user._id, res);

    const clientUrl = 'http://localhost:5173';

    res.set('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Authentication Successful</title>
        </head>
        <body>
          <p>Authentication successful. Closing window...</p>
          <script>
            try {
              const targetOrigin = "${clientUrl}";
              console.log("Popup: Attempting to post message to target origin:", targetOrigin);

              if (window.opener && window.opener.postMessage) {
                // Send a simple, non-sensitive message to the opener window
                window.opener.postMessage(
                  { type: 'oauth_success' }, // The message payload
                  targetOrigin                    // Target origin for security
                );
                console.log("Popup: Message posted successfully to", targetOrigin);
              } else {
                 // This might happen if the opener window was closed or is inaccessible
                 console.warn("Popup: window.opener or window.opener.postMessage not available.");
                 document.body.innerHTML = "Authentication successful, but couldn't automatically signal the main window. Please close this popup manually.";
              }

              // Close the popup window itself
              console.log("Popup: Closing window.");
              window.close();

            } catch (err) {
              // Log any errors that occur within the popup's script execution
              console.error("Popup: Error in script:", err);
              // Provide fallback text in the popup if the script fails
              document.body.innerHTML = "An error occurred during the final step of authentication. Please close this window and try again.";
            }
          </script>
        </body>
      </html>
    `);

  } catch (error) {
    console.error("OAuth Callback Server Error:", error);
    res.status(500).set('Content-Type', 'text/html').send(`
        <html><body>
          <h1>Authentication Failed</h1>
          <p>An error occurred: ${error.message || 'Unknown error'}.</p>
          <p>You can close this window.</p>
        </body></html>
    `);
  }
};
