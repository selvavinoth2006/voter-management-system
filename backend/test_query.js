const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function test() {
  const result = await sql.query('SELECT 1 as val');
  console.log("Result of sql.query('SELECT 1 as val'):");
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

test();
