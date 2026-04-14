const db = require('../db');

exports.castVote = async (req, res) => {
  const { election_id, candidate_id } = req.body;
  const voter_id = req.user.id;

  try {
    // 1. Verify election is active
    const electionResult = await db.query('SELECT status FROM elections WHERE election_id = $1', [election_id]);
    if (electionResult.rows.length === 0) return res.status(404).json({ error: 'Election not found' });
    if (electionResult.rows[0].status !== 'active') {
      return res.status(400).json({ error: 'This election is not currently active.' });
    }

    // 2. Check if voter has already voted in THIS election
    const checkVote = await db.query(
      'SELECT * FROM votes WHERE voter_id = $1 AND election_id = $2',
      [voter_id, election_id]
    );
    if (checkVote.rows.length > 0) {
      return res.status(400).json({ error: 'You have already cast your vote in this election.' });
    }

    // 3. Cast the vote
    const result = await db.query(
      'INSERT INTO votes (voter_id, election_id, candidate_id) VALUES ($1, $2, $3) RETURNING *',
      [voter_id, election_id, candidate_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Postgres Unique Violation
      return res.status(400).json({ error: 'You have already cast your vote in this election.' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getVoteStatus = async (req, res) => {
  const { electionId } = req.params;
  const voterId = req.user.id;
  try {
    const result = await db.query(
      'SELECT * FROM votes WHERE voter_id = $1 AND election_id = $2',
      [voterId, electionId]
    );
    res.json({ hasVoted: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
