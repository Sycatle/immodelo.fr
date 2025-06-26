// optimize_database.js
// Ce script crée des index clés, vérifie la qualité des données, et affiche des recommandations.

const { Pool } = require('pg');

async function optimize() {
  // ⚠️ Adaptez la connectionString si nécessaire (port, host, credentials).
  const pool = new Pool({
    connectionString: 'postgres://dvf:dvfpass@localhost:5433/dvfdb'
  });

  const client = await pool.connect();
  try {
    console.log('🔧 Création des index...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_dvf_date_mutation
        ON dvf_sales(date_mutation);
      CREATE INDEX IF NOT EXISTS idx_dvf_code_postal
        ON dvf_sales(code_postal);
      CREATE INDEX IF NOT EXISTS idx_dvf_commune
        ON dvf_sales(commune);
      CREATE INDEX IF NOT EXISTS idx_dvf_type_local
        ON dvf_sales(type_local);
    `);
    console.log('✅ Index créés.');

    console.log('\n🔍 Vérification de la plage de dates :');
    const { rows: dateRows } = await client.query(`
      SELECT
        MIN(date_mutation) AS min_date,
        MAX(date_mutation) AS max_date
      FROM dvf_sales;
    `);
    console.log(`📅 De ${dateRows[0].min_date.toISOString().slice(0,10)} à ${dateRows[0].max_date.toISOString().slice(0,10)}`);

    console.log('\n🔍 Comptage des valeurs manquantes :');
    const { rows: nullRows } = await client.query(`
      SELECT
        COUNT(*) FILTER (WHERE valeur_fonciere IS NULL) AS no_price,
        COUNT(*) FILTER (WHERE surface_reelle_bati IS NULL) AS no_surface
      FROM dvf_sales;
    `);
    console.log(`💰 ventes sans prix : ${nullRows[0].no_price}`);
    console.log(`🏠 ventes sans surface bati : ${nullRows[0].no_surface}`);

    console.log('\n💡 Recommandations :');
    console.log('- Envisager la partition de dvf_sales PAR RANGE(date_mutation) pour améliorer les performances');
    console.log('  (ex. partitions 2022, 2023, 2024, etc.).');
    console.log('- Si vous avez un très gros volume à venir, charger en une seule grosse opération via COPY depuis un CSV.');
    console.log('- Pensez à archiver ou purger les colonnes dont vous n’avez pas besoin.');

  } catch (err) {
    console.error('❌ Erreur lors de l’optimisation :', err);
  } finally {
    client.release();
    await pool.end();
  }
}

optimize();
