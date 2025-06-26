// data/import-dvf-to-postgres.js
const fs = require("fs");
const { Pool } = require("pg");

const DATA_FILE = __dirname + "/dvf_72.json";
const pool = new Pool({
  host:     "localhost",
  port:     5433,
  user:     "dvf",
  password: "dvfpass",
  database: "dvfdb",
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
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let importedCount = 0;
    for (const record of data) {
      // Ignore si champs indispensables manquants
      if (!record.date_mutation || !record.valeur_fonciere) {
        continue;
      }

      // Conversion et nettoyage des valeurs
      const date = record.date_mutation
        .split("/")
        .reverse()
        .join("-");
      const valeur = parseFloat(
        record.valeur_fonciere?.replace(",", ".") || "0"
      );
      const surfaceBati = parseFloat(
        (record.surface_reelle_bati?.replace(",", ".") || "0")
      );
      const nbPieces = record.nombre_pieces_principales
        ? parseInt(record.nombre_pieces_principales, 10)
        : null;
      const surfaceTerrain = record.surface_terrain
        ? parseFloat(record.surface_terrain.replace(",", "."))
        : null;

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
          date,
          record.nature_mutation || null,
          valeur,
          record.no_voie || null,
          record.type_de_voie || null,
          record.voie || null,
          record.code_postal || null,
          record.commune || null,
          record.type_local || null,
          surfaceBati,
          nbPieces,
          surfaceTerrain,
        ]
      );
      importedCount++;
    }

    await client.query("COMMIT");
    console.log(`✅ Imported ${importedCount} records.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Import failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

(async () => {
  await setup();
  await importData();
})();
