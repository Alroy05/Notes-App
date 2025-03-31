import Note from "../models/note.model.js";

export const verifyNoteOwner = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    req.note = note;
    next();
  } catch (error) {
    console.error("Error in verifyNoteOwner:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};