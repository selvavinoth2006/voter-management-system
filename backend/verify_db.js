const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function check() {
  console.log("Checking credentials in database:", process.env.DATABASE_URL);
  
  // Check Admin
  const adminRes = await sql`SELECT * FROM admins WHERE username = 'admin@gmail.com'`;
  if (adminRes.length > 0) {
    const match = await bcrypt.compare('admin@123', adminRes[0].password_hash);
    console.log(`Admin 'admin@gmail.com' exists. Password 'admin@123' match: ${match}`);
  } else {
    console.log(`Admin 'admin@gmail.com' NOT FOUND.`);
  }

  // Check Voter
  const voterRes = await sql`SELECT * FROM voters WHERE email = 'vinoth@gmail.com'`;
  if (voterRes.length > 0) {
    const match = await bcrypt.compare('vinoth@123', voterRes[0].password_hash);
    console.log(`Voter 'vinoth@gmail.com' exists. Password 'vinoth@123' match: ${match}`);
  } else {
    console.log(`Voter 'vinoth@gmail.com' NOT FOUND.`);
  }
  
  process.exit(0);
}

check();
