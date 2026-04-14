const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, candidateController.getCandidates);
router.get('/election/:electionId', verifyToken, candidateController.getCandidatesByElection);
router.post('/', verifyToken, isAdmin, candidateController.addCandidate);
router.put('/:id', verifyToken, isAdmin, candidateController.updateCandidate);
router.delete('/:id', verifyToken, isAdmin, candidateController.deleteCandidate);

module.exports = router;
