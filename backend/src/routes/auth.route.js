import express from "express";
import { 
  login, 
  logout, 
  signup, 
  checkAuth, 
  verifyEmail,
  refreshAccessToken
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/check", protectRoute, checkAuth);

export default router;