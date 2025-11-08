// controllers/profileController.js
const { User } = require("../models"); // <-- Impor model User (Sequelize)

/**
 * @desc    Mengambil data profile user yang sedang login
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMyProfile = async (req, res) => {
  try {
    // 1. Ambil ID user dari middleware 'verifyToken' (req.user.id)
    const user = await User.findByPk(req.user.id, {
      // 2. Ambil data, KECUALI password dan refresh_token
      attributes: {
        exclude: [
          "password",
          "refresh_token",
          "deleted_at",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Mapping 'name' -> 'fullName' untuk frontend
    const userProfile = user.toJSON(); // Konversi jadi objek biasa
    userProfile.fullName = userProfile.name;

    // 4. Cek 'isEmailVerified'
    // Kolom ini tidak ada di DB kamu. Mungkin logic-nya
    // 'isEmailVerified' = true jika 'email' tidak null?
    // Untuk saat ini, kita kirim 'false' atau 'true' statis
    userProfile.isEmailVerified = true; // <-- Asumsi/Hardcode, sesuaikan nanti

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Failed to get profile:", error);
    res.status(500).json({ message: "Server error getting profile" });
  }
};

/**
 * @desc    Update data profile user
 * @route   PUT /api/profile
 * @access  Private
 */
exports.updateMyProfile = async (req, res) => {
  // Ambil data dari body
  // 'major' tetap kita abaikan dulu karena tidak ada di DB
  const { name, phone } = req.body;

  // Ambil id user dari middleware
  const userId = req.user.id;

  try {
    // Cari user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update field yang relevan
    user.name = name;
    user.phone = phone;
    // Nanti jika 'major' sudah ada di DB:
    // user.major = major;

    // Simpan perubahan ke DB
    await user.save();

    // Kirim respons tanpa data sensitif
    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.refresh_token;

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
