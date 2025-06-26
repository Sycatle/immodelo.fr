const fs = require('fs');
const { Pool } = require('pg');

const DATA_FILE = __dirname + '/dvf_72.json';
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'dvf',
  password: process.env.PGPASSWORD || 'dvfpass',
  database: process.env.PGDATABASE || 'dvfdb'
});

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dvf_sales (
      id SERIAL PRIMARY KEY,
      date_mutation DATE,
      nature_mutation TEXT,
      valeur_fonciere NUMERIC,
      no_voie TEXT,
      type_de_voie TEXT,
      voie TEXT,
      code_postal TEXT,
      commune TEXT,
      type_local TEXT,
      surface_reelle_bati NUMERIC,
      nombre_pieces_principales INTEGER,
      surface_terrain NUMERIC
    );
  `);
}

async function importData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const data = JSON.parse(raw);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const record of data) {
      await client.query(
        `INSERT INTO dvf_sales (
          date_mutation,
          nature_mutation,
          valeur_fonciere,
          no_voie,
          type_de_voie,
          voie,
          code_postal,
          commune,
          type_local,
          surface_reelle_bati,
          nombre_pieces_principales,
          surface_terrain
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )`,
        [
          record.date_mutation.split('/').reverse().join('-'),
          record.nature_mutation,
          record.valeur_fonciere.replace(',', '.'),
          record.no_voie,
          record.type_de_voie,
          record.voie,
          record.code_postal,
          record.commune,
          record.type_local,
          record.surface_reelle_bati,
          record.nombre_pieces_principales,
          record.surface_terrain
        ]
      );
    }
    await client.query('COMMIT');
    console.log(`Imported ${data.length} records.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Import failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

(async () => {
  await setup();
  await importData();
})();
