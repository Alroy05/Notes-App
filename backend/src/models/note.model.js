import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(tags) {
          return tags.length <= 10;
        },
        message: "Cannot have more than 10 tags"
      }
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "#ffffff",
      validate: {
        validator: function(color) {
          return /^#([0-9A-F]{3}){1,2}$/i.test(color);
        },
        message: "Invalid color code"
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

noteSchema.index({ createdBy: 1, isPinned: -1, createdAt: -1 });
noteSchema.index({ createdBy: 1, tags: 1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;