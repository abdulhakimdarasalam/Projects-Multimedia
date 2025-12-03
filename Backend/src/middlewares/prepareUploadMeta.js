const { User } = require("../models");

module.exports = async function prepareUploadMeta(req, res, next) {
  try {
    const userId = req.user.id; // dari JWT
    const taskSubmissionId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    req.fileMeta = {
      taskSubmissionId,
      userName: user.name.replace(/\s+/g, "_"), // rapihkan (spasi → underscore)
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
