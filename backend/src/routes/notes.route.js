import express from "express";
import { 
  createNote, 
  getNotes, 
  getNoteById, 
  updateNote, 
  deleteNote,
  pinNote
} from "../controllers/notes.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { verifyNoteOwner } from "../middlewares/note.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", verifyNoteOwner, getNoteById);
router.put("/:id", verifyNoteOwner, updateNote);
router.delete("/:id", verifyNoteOwner, deleteNote);
router.patch("/:id/pin", verifyNoteOwner, pinNote);

export default router;