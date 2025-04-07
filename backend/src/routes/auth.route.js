import express from "express";
import passport from "passport";
import { 
  login, 
  logout, 
  signup, 
  checkAuth, 
  verifyEmail,
  refreshAccessToken,
  handleOAuthCallback
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/check", protectRoute, checkAuth);

// Google OAuth
router.get('/google', passport.authenticate('google', { session: false }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    handleOAuthCallback(req, res);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { session: false }));

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    handleOAuthCallback(req, res);
  }
);


export default router;