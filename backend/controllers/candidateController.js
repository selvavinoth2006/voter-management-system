const db = require('../db');

exports.getCandidates = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM candidates ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCandidatesByElection = async (req, res) => {
  const { electionId } = req.params;
  try {
    const result = await db.query('SELECT * FROM candidates WHERE election_id = $1 ORDER BY name ASC', [electionId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCandidate = async (req, res) => {
  const { name, party, constituency, age, gender, election_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO candidates (name, party, constituency, age, gender, election_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, party, constituency, age, gender, election_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCandidate = async (req, res) => {
  const { id } = req.params;
  const { name, party, constituency, age, gender, election_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE candidates SET name=$1, party=$2, constituency=$3, age=$4, gender=$5, election_id=$6 WHERE candidate_id=$7 RETURNING *',
      [name, party, constituency, age, gender, election_id, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Candidate not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM candidates WHERE candidate_id=$1', [id]);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
