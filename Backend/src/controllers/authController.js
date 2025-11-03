const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Logika 'secure' cookie yang dinamis
// 'true' jika di production, 'false' jika di development (misal: localhost)
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Opsi cookie yang konsisten
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION, // true hanya jika di HTTPS (production)
  sameSite: "strict",
  path: "/", // Penting: Tentukan path agar konsisten
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Simpan refresh token di DB
    await user.update({ refresh_token: refreshToken });

    // Kirim token
    res
      .cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS, // Gunakan opsi yang konsisten
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      })
      .json({
        accessToken,
        message: "Login successful",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ... (exports.register Anda tetap sama) ...
exports.register = async (req, res) => {
  try {
    // 1. Ambil data dari body (sesuai form frontend Anda)
    const { fullName, email, password, phone, dob, gender, role } = req.body;

    // 2. Validasi dasar
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        message: "Email, password, nama lengkap, dan peran wajib diisi.",
      });
    }

    // 3. Cek apakah email sudah terdaftar (menggunakan model 'User')
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" }); // 409 = Conflict
    }

    // 4. Hash password (menggunakan 'bcrypt' sesuai file Anda)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Buat user baru di database
    const newUser = await User.create({
      // --- PERBAIKAN DI SINI ---
      name: fullName, // Ganti 'fullName' menjadi 'name' agar cocok dengan model DB
      // -------------------------
      email: email,
      password: hashedPassword, // Simpan password yang sudah di-hash
      phone: phone,
      dob: dob,
      gender: gender,
      role: role,
    });

    // 6. Kirim respons sukses
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    // Tangani jika ada error server (konsisten dengan 'login')
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// === FUNGSI LOGOUT YANG BARU ===
exports.logout = async (req, res) => {
  try {
    // 1. Ambil refreshToken dari cookie yang masuk
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      // Jika tidak ada token, anggap sudah logout
      return res.sendStatus(204); // 204 = No Content
    }

    // 2. Cari user di DB yang memiliki token tersebut
    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    });

    // 3. Jika user ditemukan, hapus tokennya dari DB
    if (user) {
      await user.update({ refresh_token: null });
    }

    // 4. Hapus cookie dari browser
    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    // 5. Kirim respons sukses
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
