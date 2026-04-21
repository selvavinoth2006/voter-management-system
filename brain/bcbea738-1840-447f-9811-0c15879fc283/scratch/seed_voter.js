const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

const seedVoter = async () => {
  try {
    const email = 'vinoth@gmail.com';
    const password = 'vinoth@123';
    const name = 'Vinoth';
    const voterCardId = 'VOT1234567';

    const existing = await sql`SELECT * FROM voters WHERE email = ${email}`;

    if (existing.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      await sql`
        INSERT INTO voters (name, email, username, password_hash, voter_card_id, dob, gender) 
        VALUES (${name}, ${email}, ${email}, ${hash}, ${voterCardId}, '2000-01-01', 'Male')
      `;
      console.log("Test voter account created: vinoth@gmail.com / vinoth@123");
    } else {
      console.log("Voter already exists.");
      // Optional: Update password if needed
      const hash = await bcrypt.hash(password, 10);
      await sql`UPDATE voters SET password_hash = ${hash} WHERE email = ${email}`;
      console.log("Password updated for vinoth@gmail.com");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error seeding voter:", err);
    process.exit(1);
  }
};

seedVoter();
