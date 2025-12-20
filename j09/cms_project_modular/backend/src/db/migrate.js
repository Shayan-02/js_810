const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function ensureMigrationsTable(){
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function alreadyApplied(name){
  const [rows] = await pool.query("SELECT 1 FROM _migrations WHERE name=? LIMIT 1", [name]);
  return rows.length > 0;
}

async function markApplied(name){
  await pool.query("INSERT INTO _migrations (name) VALUES (?)", [name]);
}

async function run(){
  const dir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort();

  await ensureMigrationsTable();

  for(const file of files){
    const name = file;
    if(await alreadyApplied(name)){
      console.log(`✓ skip ${name}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    console.log(`→ apply ${name}`);
    // Allow multiple statements separated by ; by using pool.query one-by-one
    // Simple splitter (good enough for our migrations).
    const statements = sql
      .split(/;\s*\n/g)
      .map(s => s.trim())
      .filter(Boolean);

    const conn = await pool.getConnection();
    try{
      await conn.beginTransaction();
      for(const st of statements){
        await conn.query(st);
      }
      await conn.query("INSERT INTO _migrations (name) VALUES (?)", [name]);
      await conn.commit();
      console.log(`✓ applied ${name}`);
    }catch(e){
      await conn.rollback();
      console.error(`✗ failed ${name}`, e.message);
      process.exitCode = 1;
      break;
    }finally{
      conn.release();
    }
  }
  await pool.end();
}

run();
