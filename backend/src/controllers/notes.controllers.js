import Note from "../models/note.model.js";

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

export const createNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned, color } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newNote = await Note.create({
      title,
      content,
      tags: tags || [],
      isPinned: isPinned || false,
      color: color || "#ffffff",
      createdBy: req.user._id
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error in createNote:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { page = 1, size = 10, search, tag, sortBy = '-createdAt' } = req.query;
    const { limit, offset } = getPagination(page, size);
    
    const query = { createdBy: req.user._id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tag) {
      query.tags = tag;
    }

    const notes = await Note.find(query)
      .sort(sortBy)
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await Note.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      notes
    });
  } catch (error) {
    console.error("Error in getNotes:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned, color } = req.body;
    
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { title, content, tags, isPinned, color, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const pinNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in pinNote:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};