const fs = require("fs");
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

// Configuration des trois années à traiter
const DATASETS = [
  {
    year: 2024,
    zipUrl:
      "https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/20250406-003043/valeursfoncieres-2024.txt.zip",
    zipName: "valeursfoncieres-2024.txt.zip",
    txtName: "valeursfoncieres-2024.txt",
  },
  {
    year: 2023,
    zipUrl:
      "https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/20250406-003027/valeursfoncieres-2023.txt.zip",
    zipName: "valeursfoncieres-2023.txt.zip",
    txtName: "valeursfoncieres-2023.txt",
  },
  {
    year: 2022,
    zipUrl:
      "https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/20250406-003011/valeursfoncieres-2022.txt.zip",
    zipName: "valeursfoncieres-2022.txt.zip",
    txtName: "valeursfoncieres-2022.txt",
  },
];

const OUTPUT_JSON = "dvf_72.json";

// Normalise une chaîne : supprime accents, remplace tirets/apostrophes, etc.
function normalizeCommune(str) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-'’]/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (word === "st") return "saint";
      if (word === "ste") return "sainte";
      return word;
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

// Télécharge un ZIP dans un fichier local
async function downloadZip(zipUrl, zipName) {
  console.log(`Téléchargement ${zipName}...`);
  const res = await fetch(zipUrl);
  const fileStream = fs.createWriteStream(zipName);
  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
}

// Décompresse un ZIP local
async function unzipFile(zipName) {
  console.log(`Décompression ${zipName}...`);
  return fs
    .createReadStream(zipName)
    .pipe(unzipper.Extract({ path: "." }))
    .promise();
}

// Filtrage des ventes 72 dans un fichier TXT donné
async function filter72FromTxt(txtName) {
  console.log(`Filtrage ${txtName}...`);
  const input = fs.createReadStream(txtName, { encoding: "utf-8" });
  const rl = readline.createInterface({ input });
  const headers = [];
  const seen = new Set();
  const filtered = [];

  for await (const line of rl) {
    const cols = line.split("|");
    if (!headers.length) {
      headers.push(
        ...cols.map((h) => normalizeCommune(h).replace(/\s+/g, "_"))
      );
      continue;
    }

    const obj = Object.fromEntries(
      headers
        .map((h, i) => [h, cols[i]?.trim()])
        .filter(([key, value]) => fieldsToKeep.includes(key) && value)
    );

    if (obj.commune) obj.commune = normalizeCommune(obj.commune);
    const cp = obj.code_postal;
    const mutation = obj.nature_mutation?.toLowerCase();

    if (/^\d{5}$/.test(cp) && cp.startsWith("72") && mutation === "vente") {
      const key = `${obj.no_voie}_${obj.type_de_voie}_${obj.voie}_${obj.surface_reelle_bati}`;
      if (!seen.has(key)) {
        seen.add(key);
        filtered.push(obj);
      }
    }
  }

  console.log(`✅ ${filtered.length} ventes extraites de ${txtName}`);
  return filtered;
}

(async () => {
  try {
    const allFiltered = [];
    for (const ds of DATASETS) {
      await downloadZip(ds.zipUrl, ds.zipName);
      await unzipFile(ds.zipName);
      const yearFiltered = await filter72FromTxt(ds.txtName);
      allFiltered.push(...yearFiltered);
    }
    console.log(`Total ventes uniques avant écriture: ${allFiltered.length}`);
    // On pourrait dédupliquer encore sur l'ensemble :
    const uniqueAll = [];
    const seenAll = new Set();
    for (const obj of allFiltered) {
      const key = `${obj.no_voie}_${obj.type_de_voie}_${obj.voie}_${obj.surface_reelle_bati}_${obj.date_mutation}`;
      if (!seenAll.has(key)) {
        seenAll.add(key);
        uniqueAll.push(obj);
      }
    }
    console.log(`Total ventes uniques consolidées: ${uniqueAll.length}`);
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(uniqueAll, null, 2), "utf-8");
    console.log(`✅ ${OUTPUT_JSON} prêt avec ${uniqueAll.length} ventes.`);
  } catch (err) {
    console.error("❌ Erreur :", err);
  }
})();
