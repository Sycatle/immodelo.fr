const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const unzipper = require("unzipper");
const readline = require("readline");

const fieldsToKeep = [
  "date_mutation",
  "nature_mutation",
  "valeur_fonciere",
  "code_postal",
  "commune",
  "type_local",
  "surface_reelle_bati",
  "nombre_pieces_principales",
  "surface_terrain",
  "no_voie",
  "type_de_voie",
  "voie",
];

const ZIP_URL =
  "https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/20250406-003043/valeursfoncieres-2024.txt.zip";
const ZIP_NAME = "valeursfoncieres-2024.txt.zip";
const TXT_NAME = "valeursfoncieres-2024.txt";
const OUTPUT_JSON = "dvf_72.json";

// Télécharge le fichier ZIP
async function downloadZip() {
  console.log("Téléchargement...");
  const res = await fetch(ZIP_URL);
  const fileStream = fs.createWriteStream(ZIP_NAME);
  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
}

// Décompresse le ZIP et extrait le fichier TXT
async function unzipFile() {
  console.log("Décompression...");
  return fs
    .createReadStream(ZIP_NAME)
    .pipe(unzipper.Extract({ path: "." }))
    .promise();
}

// Lis le fichier TXT ligne par ligne et filtre par code postal
async function filter72() {
  console.log("Filtrage des lignes...");
  const input = fs.createReadStream(TXT_NAME, { encoding: "utf-8" });
  const rl = readline.createInterface({ input });

  const headers = [];
  const filtered = [];

  for await (const line of rl) {
    const cols = line.split("|");
    if (!headers.length) {
      headers.push(...cols); // première ligne = headers
      continue;
    }

    // Fonction de slugification
    function slugify(str) {
      return str
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_")
        .trim();
    }

    const obj = Object.fromEntries(
      headers
        .map((h, i) => {
          const key = slugify(h);
          const value = cols[i]?.trim();
          return [key, value];
        })
        .filter(([key, value]) => fieldsToKeep.includes(key) && value !== "")
    );

    const cp = obj["code_postal"];
    if (!cp) continue; // Ignore les lignes sans code postal

    if (cp && cp.startsWith("72")) {
      filtered.push(obj);
    }
  }

  console.log(`✅ ${filtered.length} lignes extraites`);
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(filtered, null, 2), "utf-8");
}

(async () => {
  try {
    await downloadZip();
    await unzipFile();
    await filter72();
    console.log("✅ dvf_72.json prêt.");
  } catch (err) {
    console.error("❌ Erreur :", err);
  }
})();
