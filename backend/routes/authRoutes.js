const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/admin-login', authController.adminLogin);
router.post('/voter-login', authController.voterLogin);
router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router;
