# Immodelo

Immodelo est une application d'estimation immobilière développée avec **Next.js 15** et **TypeScript**. Elle exploite la nouvelle App Router pour servir un formulaire multiétapes permettant d'obtenir rapidement une valeur indicatrice pour un bien situé dans la Sarthe (72).

## Stack technique

- **Next.js 15** avec le mode App Router et les Server Actions
- **React 19** et **TypeScript 5**
- **Tailwind CSS 4** pour la mise en page (animations via `tw-animate-css`)
- **Radix UI** pour les composants accessibles
- **Framer Motion** pour les transitions de formulaire
- **PostgreSQL 15** (via Docker) et `node-postgres` pour l'accès aux données DVF
- **pnpm** pour la gestion des dépendances

## Installation

1. Assurez-vous d'avoir **Node.js ≥18** et `pnpm` installés.
2. Installez les dépendances du projet :

```bash
pnpm install
```

3. Lancez le serveur de développement :

```bash
pnpm dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Mise à jour des données DVF

Les estimations reposent sur la base **Demandes de valeurs foncières** (DVF) des années 2022, 2023 et 2024. Le script `data/extra-72.js` télécharge les archives depuis data.gouv.fr, les décompresse et filtre toutes les ventes dont le code postal commence par `72` avant d'enregistrer le résultat dans `data/dvf_72.json`.

```bash
node data/extra-72.js
```

### Import PostgreSQL avec Docker

1. Démarrez la base locale :

```bash
docker-compose up -d db
```

2. Créez la table et importez les ventes :

```bash
node data/import-dvf-to-postgres.js
```

Une base `dvfdb` est alors accessible sur `localhost:5433` avec la table `dvf_sales` contenant les transactions filtrées.

## Fonctionnement de l'application

La page d'accueil présente un formulaire en six étapes (« Adresse », « À propos du bien », « Informations principales », etc.) dont la validation est réalisée côté client à l'aide de Zod. Les suggestions d'adresse proviennent du service `api-adresse.data.gouv.fr` et une carte (React Leaflet) se centre automatiquement sur le point saisi.

À l'envoi du formulaire, les données sont envoyées en `POST` à l'API `/api/estimate`. Cette route est protégée par un petit rate limiter et invoque la fonction `estimatePrice` du module `src/lib/estimate.ts`.

## Algorithme d'estimation

La fonction `estimatePrice` applique les étapes suivantes :

1. **Sélection des ventes pertinentes** dans `dvf_sales` :
   - même code postal et même type de bien,
   - commune identique après normalisation (suppression des accents, etc.),
   - surfaces et valeurs non nulles et supérieures à 10.
2. **Calcul du prix au m²** pour chaque vente retenue puis exclusion des valeurs aberrantes. Les ventes dont le prix au m² s'écarte de plus de 1,5 écart-type autour de la médiane sont ignorées.
3. **Médiane finale** : une nouvelle médiane du prix au m² est calculée sur l'échantillon filtré.
4. **Application de coefficients légers** selon l'état du bien et ses équipements :
   - +1 % si le bien est « Comme neuf », −3 % si « Travaux importants »,
   - +1 % s'il y a une piscine,
   - −1 % en l'absence de tout-à-l'égout,
   - +1 % pour un logement très lumineux,
   - −2 % si le quartier est très bruyant.
   Le cumul est borné à ±5 %.
5. **Bonus fixes** :
   - 4 000 € par place de parking (dans la limite de 2),
   - 3 000 € par dépendance (max 2),
   - petit bonus de terrain si la surface totale dépasse la surface habitable.
6. **Retrait des frais** : 7 % sont soustraits pour simuler les frais d'agence et de notaire.

La fonction renvoie enfin un objet contenant :

```ts
{
  estimatedPrice: number,       // prix final arrondi
  similarSalesCount: number,    // nombre de ventes comparables utilisées
  averagePricePerM2: number     // médiane du prix au m² retenue
}
```

Si moins de trois ventes comparables sont disponibles, `null` est retourné.

## Structure du projet

```
src/
├─ app/                 Pages Next.js et route API
├─ components/
│  ├─ forms/            Formulaire d'estimation (React + Framer Motion)
│  ├─ sections/         Sections de page (Hero, etc.)
│  └─ ui/               Petits composants visuels basés sur Radix
├─ lib/                 Utilitaires (estimate.ts, db.ts, validation.ts ...)
public/                 Fichiers statiques
data/                   Scripts Node pour la base DVF
```

D'autres fichiers importants :

- `docker-compose.yml` : configuration PostgreSQL (port 5433, utilisateur `dvf`/`dvfpass`).
- `tailwind.config.js` et `postcss.config.mjs` : configuration Tailwind CSS.

## Licence

Ce projet est fourni sans garantie. Les données DVF sont publiques ([data.gouv.fr](https://www.data.gouv.fr)) et l'estimation produite reste indicative, elle ne remplace pas l'avis d'un professionnel de l'immobilier.

