const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

const initDb = async () => {
  try {
    console.log("Initializing database tables...");

    // 1. Admins Table
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Elections Table
    await sql`
      CREATE TABLE IF NOT EXISTS elections (
        election_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        election_date DATE,
        status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, active, completed
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Voters Table (with updates)
    await sql`
      CREATE TABLE IF NOT EXISTS voters (
        voter_id SERIAL PRIMARY KEY,
        voter_card_id VARCHAR(10) UNIQUE,
        name VARCHAR(255) NOT NULL,
        dob DATE,
        gender VARCHAR(50),
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255) UNIQUE,
        username VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        has_changed_password BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Helper to add missing columns to voters if table already exists
    try {
      await sql`ALTER TABLE voters ADD COLUMN IF NOT EXISTS voter_card_id VARCHAR(10) UNIQUE`;
      // Ensure existing column is NOT NULL (assuming migration already ran)
      try { await sql`ALTER TABLE voters ALTER COLUMN voter_card_id SET NOT NULL`; } catch (e) {}
      await sql`ALTER TABLE voters ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE`;
      await sql`ALTER TABLE voters ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE`;
      await sql`ALTER TABLE voters ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`;
      await sql`ALTER TABLE voters ADD COLUMN IF NOT EXISTS has_changed_password BOOLEAN DEFAULT FALSE`;
      await sql`ALTER TABLE voters ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
    } catch (e) {
      console.log("Voters table already has new columns or error adding them:", e.message);
    }

    // 4. Candidates Table
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        candidate_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        party VARCHAR(255),
        constituency VARCHAR(255),
        age INTEGER,
        gender VARCHAR(50),
        election_id INTEGER REFERENCES elections(election_id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Helper to add missing columns to candidates
    try {
      await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS age INTEGER`;
      await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender VARCHAR(50)`;
      await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS election_id INTEGER REFERENCES elections(election_id) ON DELETE SET NULL`;
      await sql`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
    } catch (e) {
      console.log("Candidates table already has new columns or error adding them:", e.message);
    }

    // 5. Votes Table
    await sql`
      CREATE TABLE IF NOT EXISTS votes (
        vote_id SERIAL PRIMARY KEY,
        voter_id INTEGER REFERENCES voters(voter_id) ON DELETE CASCADE,
        election_id INTEGER REFERENCES elections(election_id) ON DELETE CASCADE,
        candidate_id INTEGER REFERENCES candidates(candidate_id) ON DELETE CASCADE,
        voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(voter_id, election_id)
      )
    `;

    await seedAdmin();
    
    console.log("Database tables initialized and seeded successfully");
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
};

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin1@gmail.com';
    const adminPass = 'admin@123';
    
    const existing = await sql`SELECT * FROM admins WHERE username = ${adminEmail}`;
    
    if (existing.length === 0) {
      const hash = await bcrypt.hash(adminPass, 10);
      await sql`
        INSERT INTO admins (username, password_hash, role) 
        VALUES (${adminEmail}, ${hash}, 'admin')
      `;
      console.log("Default admin account created.");
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
};

module.exports = {
  query: async (text, params) => {
    try {
      let rows;
      if (!params || params.length === 0) {
        rows = await sql.query(text);
      } else {
        rows = await sql.query(text, params);
      }
      return { rows };
    } catch (err) {
      console.error("Database query error:", err);
      throw err;
    }
  },
  initDb
};
