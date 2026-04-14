const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, isAdmin, resultController.getAdminStats);
router.get('/:electionId', verifyToken, resultController.getElectionResults);
router.get('/:electionId/winner', verifyToken, resultController.getElectionWinner);

module.exports = router;
