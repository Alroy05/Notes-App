import express from "express";
import { 
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getActiveSessions,
  revokeSession
} from "../controllers/user.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.use(protectRoute);

router.get("/me", getProfile);
router.put("/me", updateProfile);
router.put("/me/password", changePassword);
router.delete("/me", deleteAccount);
router.get("/me/sessions", getActiveSessions);
router.delete("/me/sessions/:sessionId", revokeSession);

export default router;