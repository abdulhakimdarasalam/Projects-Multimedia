// routes/dashboardUserRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardUserController'); // Perhatikan nama controllernya

// Rute ini akan menjadi GET /api/v1/dashboard-user/stats
router.get('/stats', getDashboardStats);

module.exports = router;