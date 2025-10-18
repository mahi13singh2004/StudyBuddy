import Folder from "../models/folder.model.js";
import Note from "../models/note.model.js";
import User from "../models/user.model.js";
import GeminiUtil from "../utils/geminiUtil.js";

export const handleAIAction = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { action } = req.body;
    const userId = req.user._id;

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }

    if (!folder.user.equals(userId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    
    const notes = await Note.find({ folder: folderId, user: userId });
    if (notes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No notes found in this folder" });
    }
    
    const combinedContent = notes.map((n) => n.content).join("\n\n");
    const result = await GeminiUtil.generateAIResult(action, combinedContent);

    await User.findByIdAndUpdate(userId, { $inc: { aiQueries: 1 } });
    
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.log("Error in handleAIAction", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
