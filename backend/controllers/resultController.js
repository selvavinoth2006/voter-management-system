const db = require('../db');

exports.getElectionResults = async (req, res) => {
  const { electionId } = req.params;
  try {
    const result = await db.query(
      `SELECT c.candidate_id, c.name, c.party, COUNT(v.vote_id) as vote_count
       FROM candidates c
       LEFT JOIN votes v ON c.candidate_id = v.candidate_id
       WHERE c.election_id = $1
       GROUP BY c.candidate_id, c.name, c.party
       ORDER BY vote_count DESC`,
      [electionId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getElectionWinner = async (req, res) => {
  const { electionId } = req.params;
  try {
    const result = await db.query(
      `SELECT c.candidate_id, c.name, c.party, COUNT(v.vote_id) as vote_count
       FROM candidates c
       LEFT JOIN votes v ON c.candidate_id = v.candidate_id
       WHERE c.election_id = $1
       GROUP BY c.candidate_id, c.name, c.party
       ORDER BY vote_count DESC
       LIMIT 1`,
      [electionId]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const votersCount = await db.query('SELECT COUNT(*) FROM voters');
    const electionsCount = await db.query('SELECT COUNT(*) FROM elections');
    const candidatesCount = await db.query('SELECT COUNT(*) FROM candidates');
    const votesCount = await db.query('SELECT COUNT(*) FROM votes');
    
    res.json({
      totalVoters: votersCount.rows[0].count,
      totalElections: electionsCount.rows[0].count,
      totalCandidates: candidatesCount.rows[0].count,
      totalVotes: votesCount.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
