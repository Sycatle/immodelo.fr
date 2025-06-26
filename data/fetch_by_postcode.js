// fetch_sales_72220.js
const { Pool } = require('pg');

async function fetchByPostcode(cp) {
  const pool = new Pool({
    connectionString: 'postgres://dvf:dvfpass@localhost:5433/dvfdb'
  });

  try {
    const { rows } = await pool.query(
      `SELECT *
       FROM dvf_sales
       WHERE code_postal = $1
       ORDER BY date_mutation DESC`,
      [cp]
    );

    console.log(`📍 Ventes pour le code postal ${cp} : ${rows.length} enregistrement(s)\n`);
    // Affiche chaque vente (date, prix, surface, adresse)
    rows.forEach(r => {
      console.log(
        `${r.date_mutation.toISOString().slice(0,10)} | ` +
        `${r.valeur_fonciere}€ | ` +
        `${r.surface_reelle_bati}m² | ` +
        `${r.commune} | ` +
        `${[r.no_voie, r.type_de_voie, r.voie].filter(Boolean).join(' ')}`
      );
    });
  } catch (err) {
    console.error('❌ Erreur lors de la requête :', err);
  } finally {
    await pool.end();
  }
}

(async () => {
  await fetchByPostcode('72220');
})();
