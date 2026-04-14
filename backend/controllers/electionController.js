const db = require('../db');

exports.getElections = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM elections ORDER BY election_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveElections = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM elections WHERE status = 'active' ORDER BY election_date ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addElection = async (req, res) => {
  const { title, description, election_date, status } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO elections (title, description, election_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, election_date, status || 'upcoming']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateElection = async (req, res) => {
  const { id } = req.params;
  const { title, description, election_date, status } = req.body;
  try {
    const result = await db.query(
      'UPDATE elections SET title=$1, description=$2, election_date=$3, status=$4 WHERE election_id=$5 RETURNING *',
      [title, description, election_date, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Election not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteElection = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM elections WHERE election_id=$1', [id]);
    res.json({ message: 'Election deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
