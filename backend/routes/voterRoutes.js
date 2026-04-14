const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, voterController.getVoters);
router.get('/me', verifyToken, voterController.getProfile);
router.post('/', verifyToken, isAdmin, voterController.addVoter);
router.put('/:id', verifyToken, isAdmin, voterController.updateVoter);
router.delete('/:id', verifyToken, isAdmin, voterController.deleteVoter);

module.exports = router;
