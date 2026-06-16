const { supabase } = require("../config/supabase");
const db = require("../db/queries");

const getUserProfile = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("getUserProfile failed: ", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(
        `user_${req.user.id}/${Date.now()}-${req.file.originalname}`,
        req.file.buffer,
        { contentType: req.file.mimetype },
      );

    if (error) throw error;

    const uploaded = db.saveMetadata(
      req.user.id,
      data.path,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
    );

    if (!uploaded) {
      console.error("saveMetadata failed");
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({
      fileName: req.file.originalname,
      message: "File uploaded",
      data: data,
    });
  } catch (error) {
    console.error("uploadFile failed: ", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUploadedFiles = async (req, res) => {
  try {
    const files = await db.getUserFiles(req.user.id);

    if (!files || files.length === 0) {
      return res.status(200).json({
        message: "success",
        userFiles: [],
      });
    }

    const userFiles = files.map((file) => {
      return {
        ...file,
        url: `https://ftzvjmstzwdvacsyxnat.supabase.co/storage/v1/object/public/uploads/${file.storage_path}`,
      };
    });

    res.status(200).json({
      message: "success",
      userFiles,
    });
  } catch (error) {
    console.error("getUploadedFiles failed: ", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserProfile,
  uploadFile,
  getUploadedFiles,
};
