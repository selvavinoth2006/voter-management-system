const db = require('../db');
const bcrypt = require('bcryptjs');

const formatDOBToPassword = (dobString) => {
  // dobString is usually YYYY-MM-DD from the DB or frontend
  const date = new Date(dobString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

exports.getVoters = async (req, res) => {
  try {
    const result = await db.query('SELECT voter_id, voter_card_id, name, dob, gender, address, phone, email, username, has_changed_password FROM voters ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT voter_id, voter_card_id, name, dob, gender, address, phone, email, username FROM voters WHERE voter_id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Voter not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addVoter = async (req, res) => {
  const { voter_card_id, name, dob, gender, address, phone, email, username } = req.body;
  
  if (!voter_card_id) {
    return res.status(400).json({ error: 'Voter Card ID is required.' });
  }

  try {
    // Generate default password from DOB (DDMMYYYY)
    const defaultPassword = formatDOBToPassword(dob);
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const result = await db.query(
      'INSERT INTO voters (voter_card_id, name, dob, gender, address, phone, email, username, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING voter_id, voter_card_id, name, dob, gender, address, phone, email, username',
      [voter_card_id, name, dob, gender, address, phone, email, username, passwordHash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVoter = async (req, res) => {
  const { id } = req.params;
  const { voter_card_id, name, dob, gender, address, phone, email, username } = req.body;
  try {
    const result = await db.query(
      'UPDATE voters SET voter_card_id=$1, name=$2, dob=$3, gender=$4, address=$5, phone=$6, email=$7, username=$8 WHERE voter_id=$9 RETURNING *',
      [voter_card_id, name, dob, gender, address, phone, email, username, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Voter not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVoter = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM voters WHERE voter_id=$1', [id]);
    res.json({ message: 'Voter deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
