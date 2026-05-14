// routes/dashboardUserRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardUserController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/stats', verifyToken, getDashboardStats);

module.exports = router;