# Mettre « Mon cahier annoté » en ligne

Durée : 15 à 20 minutes. Coût : 0 € (forfait gratuit Spark de Firebase + Netlify gratuit).

Contenu du dossier :

| Fichier | Rôle |
|---|---|
| `index.html` | l'application |
| `firebase.js` | connexion Google + enregistrement dans Firestore |
| `config.js` | **à remplir** avec la configuration de votre projet Firebase |
| `firestore.rules` | règles de sécurité à coller dans Firebase |
| `manifest.webmanifest`, `icon-*.png` | pour installer l'appli sur l'écran d'accueil de la tablette |
| `pages/` | les pages du corrigé de l'exercice 2.3 (document d'exemple) |

---

## Étape 1 — Projet Firebase

Version « même projet que le jeu » : réutilisez **president-jeu**. Les cahiers sont rangés dans une collection à part (`cahier`) et ne touchent pas aux données du jeu. Pour la configuration, recopiez celle du jeu dans `config.js` (⚙ Paramètres du projet → Vos applications).

Version « projet séparé » :

> Utilisez un **nouveau** projet, pas « president-jeu » : les règles de sécurité de l'un écraseraient celles de l'autre.

1. Ouvrez https://console.firebase.google.com → **Ajouter un projet** → nom : `cahier-annote` → Google Analytics : pas nécessaire → **Créer**.
2. Sur la page d'accueil du projet, cliquez sur l'icône **Web `</>`** → surnom : `cahier` → **Enregistrer l'application** (ne cochez pas Firebase Hosting).
3. Firebase affiche un bloc `const firebaseConfig = { apiKey: ..., authDomain: ..., ... }`.
   Ouvrez `config.js` et remplacez les 6 valeurs par les vôtres (gardez `window.FIREBASE_CONFIG = {` ... `};`).

## Étape 2 — Activer la connexion Google

1. Menu de gauche → **Créer** → **Authentication** → **Commencer**.
2. Onglet **Sign-in method** → **Google** → **Activer** → choisissez votre e-mail d'assistance → **Enregistrer**.

## Étape 3 — Créer la base Firestore

1. Menu **Créer** → **Firestore Database** → **Créer une base de données**.
2. Emplacement : **europe-west9 (Paris)** ou **eur3 (Europe)** → mode **production** → **Créer**.
3. Onglet **Règles** : **ne supprimez rien** si le projet sert aussi au jeu ; ajoutez le bloc `match /cahier/...` du fichier `firestore.rules` à l'intérieur de `match /databases/{database}/documents { … }`, puis **Publier**.

## Étape 4 — Mettre le site en ligne sur Netlify

Le plus simple (sans GitHub) :
1. https://app.netlify.com → **Add new site** → **Deploy manually**.
2. Glissez-déposez **le dossier** `cahier-annote` (celui qui contient `index.html`, après avoir rempli `config.js`).
3. **Site configuration** → **Change site name** → `cahier-annote` (ou un autre nom libre).
   Votre adresse : `https://cahier-annote.netlify.app`.

Avec GitHub (comme pour le jeu) : créez un dépôt, poussez le contenu du dossier, puis **Add new site → Import an existing project** ; aucune commande de build, dossier de publication : `/`.

## Étape 5 — Autoriser l'adresse Netlify dans Firebase

Firebase → **Authentication** → **Settings** → **Authorized domains** → **Add domain** → `cahier-annote.netlify.app`.
Sans cette étape, la connexion Google affiche l'erreur `auth/unauthorized-domain`.

## Étape 6 — Installer l'appli sur la tablette

- **iPad (Safari)** : ouvrez l'adresse → bouton **Partager** → **Sur l'écran d'accueil**.
- **Android (Chrome)** : menu ⋮ → **Installer l'application**.
Elle s'ouvre alors en plein écran, comme une vraie application.

---

## Bon à savoir

- Chacun se connecte avec son compte Google et ne voit **que ses propres cahiers** (règles de sécurité). Vous pouvez donner l'adresse à vos camarades.
- Tout est enregistré dans Firestore : notes, pages importées et images, synchronisées entre vos appareils. Les cahiers déjà ouverts restent consultables **hors connexion** sur l'appareil.
- Forfait gratuit Firestore : 1 Gio de données, 50 000 lectures et 20 000 écritures par jour. Une page importée pèse environ 200 à 400 Ko : comptez environ 3 000 pages avant d'atteindre la limite de stockage.
- Mettre à jour l'appli plus tard : redéposez le dossier dans Netlify (**Deploys** → zone de dépôt), ou poussez sur GitHub.

## En cas de problème

| Message | Solution |
|---|---|
| « Configuration Firebase manquante » | `config.js` n'est pas rempli (ou mal recopié). |
| `auth/unauthorized-domain` | Étape 5. |
| `auth/popup-blocked` | Autorisez les fenêtres pop-up pour le site, ou réessayez : l'appli bascule alors en connexion par redirection. |
| La bibliothèque ne se charge pas, « permission denied » | Règles Firestore de l'étape 3 non publiées. |
