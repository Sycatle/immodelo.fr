# Immodelo

Immodelo est une mini application Next.js permettant d'obtenir une estimation rapide pour un bien immobilier situé dans le département de la Sarthe (72). Le projet utilise les nouvelles fonctionnalités de l'App Router de Next.js 15 et Tailwind CSS pour la partie visuelle.

## Installation

```bash
pnpm install
```

## Lancement du serveur de développement

```bash
pnpm dev
```

Le site est alors accessible sur `http://localhost:3000`.

## Mise à jour de la base DVF

Les estimations sont basées sur l'extraction 2024 de la base **Demandes de valeurs foncières** (DVF) disponible sur data.gouv.fr. Le script `data/extra-72.js` télécharge l'archive officielle, la décompresse puis filtre uniquement les ventes dont le code postal commence par `72`. Le résultat est enregistré dans `data/dvf_72.json`.

```bash
node data/extra-72.js
```

## Stockage DVF avec PostgreSQL et Docker

1. Démarrez PostgreSQL via Docker :

```bash
docker-compose up -d db
```

2. Installez les dépendances puis importez les données :

```bash
pnpm install
node data/import-dvf-to-postgres.js
```

La base `dvfdb` contient alors la table `dvf_sales` avec toutes les ventes du département 72.


## Fonctionnement de l'application

La page d'accueil contient un composant `Hero` qui affiche un formulaire d'estimation en trois étapes :

1. **Adresse** – saisie de l'adresse avec suggestions provenant de `api-adresse.data.gouv.fr`.
2. **Informations sur le bien** – surface, type de bien (maison/appartement/terrain/autre), nombre de chambres et divers critères complémentaires.
3. **Contact** – coordonnées de l'utilisateur permettant de recevoir le résultat.

Une barre de progression indique l'étape en cours et chaque champ de formulaire est validé en temps réel. Une fois les informations remplies, un appel `POST` est effectué vers `/api/estimate`.

## Détail du calcul d'estimation

Le module `src/lib/estimate.ts` (utilisé à la fois côté serveur et dans l'API) contient la logique suivante :

1. Conversion et nettoyage des données saisies (surface cible, type de bien et code postal).
2. Lecture de la table `dvf_sales` dans PostgreSQL contenant l'historique des transactions de l'année 2024.
3. Filtrage de toutes les ventes répondant aux critères :
   - `nature_mutation` vaut "Vente" ;
   - le `code_postal` est identique au code saisi ;
   - `type_local` correspond au type de bien (maison, appartement, …) ;
   - la surface réelle bâtie est comprise entre 80 % et 120 % de la surface demandée ;
   - la valeur foncière est supérieure à 10 000 € pour éviter les anomalies.
4. Pour chaque vente retenue, calcul du prix au m² (valeur foncière ÷ surface).
5. Calcul de la moyenne de ces prix au m².
6. Multiplication de cette moyenne par la surface du bien de l'utilisateur pour obtenir le `estimatedPrice` final.
7. L'API renvoie également le nombre de ventes similaires prises en compte (`similarSalesCount`) et la moyenne du prix au m² (`averagePricePerM2`).

Si aucune vente ne correspond, l'API renvoie `null`.

```ts
export default async function estimatePrice(data: EstimateInput): Promise<EstimateResult | null> {
  const targetSurface = parseFloat(String(data.surface));
  const propertyType = data.propertyType.trim().toLowerCase();
  const postcode = data.postcode.trim();
  // ...
}
```

## Architecture

- `src/app` : pages Next.js (App Router) et route API `api/estimate`.
- `src/components` : composants React (formulaire, UI, etc.).
- `src/lib` : fonctions utilitaires dont `estimate.ts`.
- `data` : script et fichier JSON contenant l'extrait DVF.

## Licence

Ce projet est fourni sans garantie. Les données DVF sont des données publiques disponibles sur [data.gouv.fr](https://www.data.gouv.fr). L'estimation fournie est indicative et ne remplace pas l'expertise d'un professionnel.
