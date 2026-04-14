const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, electionController.getElections);
router.get('/active', verifyToken, electionController.getActiveElections);
router.post('/', verifyToken, isAdmin, electionController.addElection);
router.put('/:id', verifyToken, isAdmin, electionController.updateElection);
router.delete('/:id', verifyToken, isAdmin, electionController.deleteElection);

module.exports = router;
