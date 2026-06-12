const getUserProfile = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("getUserProfile failed: ", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res
      .status(200)
      .json({ fileName: req.file.originalname, message: "File uploaded" });
  } catch (error) {
    console.error("uploadFile failed: ", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserProfile,
  uploadFile,
};
