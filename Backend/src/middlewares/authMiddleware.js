const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      if (err.name === "TokenExpiredError") {
        req.expiredToken = token;
        return next("tokenExpired");
      }
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Middleware otomatis memperbarui access token
exports.autoRefreshToken = async (err, req, res, next) => {
  if (err !== "tokenExpired") return next(err);

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token missing" });

    // Cari user yang punya refresh token ini
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    // Verifikasi refresh token
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (verifyErr) => {
        if (verifyErr)
          return res.status(403).json({ message: "Refresh token expired" });

        // Buat refresh token BARU (rotate)
        const newRefreshToken = jwt.sign(
          { id: user.id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        // Update refresh token di DB
        await user.update({ refresh_token: newRefreshToken });

        // Buat access token baru
        const newAccessToken = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );

        // Kirim access token baru ke client
        res.setHeader("x-access-token", newAccessToken);
        req.user = { id: user.id, role: user.role };

        console.log("✅ Access token refreshed automatically");
        next();
      }
    );
  } catch (error) {
    console.error("Auto refresh error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
