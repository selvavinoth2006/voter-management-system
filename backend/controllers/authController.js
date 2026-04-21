const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, role: 'admin', username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: 'admin', username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.voterLogin = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be voter_id, username, email or voter_card_id
  try {
    let query = 'SELECT * FROM voters WHERE email = $1 OR username = $1 OR voter_card_id = $1';
    let params = [identifier];

    // If identifier is a number, also check voter_id
    if (!isNaN(identifier) && identifier.length < 10) {
      query += ' OR voter_id = $2';
      params.push(parseInt(identifier));
    }

    const result = await db.query(query, params);
    const voter = result.rows[0];

    if (!voter || !(await bcrypt.compare(password, voter.password_hash))) {
      return res.status(401).json({ error: 'Invalid voter credentials' });
    }

    const token = jwt.sign(
      { id: voter.voter_id, role: 'voter', name: voter.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: 'voter',
      voter: {
        id: voter.voter_id,
        voterCardId: voter.voter_card_id,
        name: voter.name,
        email: voter.email,
        hasChangedPassword: voter.has_changed_password
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const voterId = req.user.id;

  try {
    const voterResult = await db.query('SELECT password_hash FROM voters WHERE voter_id = $1', [voterId]);
    const voter = voterResult.rows[0];

    if (!voter || !(await bcrypt.compare(currentPassword, voter.password_hash))) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE voters SET password_hash = $1, has_changed_password = TRUE WHERE voter_id = $2',
      [newHash, voterId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
