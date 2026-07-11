# Tâches réalisées pour le frontend Next.js

## 1. Scaffolding du projet
- Création du projet Next.js 14 (App Router, TypeScript, Tailwind CSS) dans `/home/garfi/projects/lesuffete-front`, en dehors du dépôt backend.
- Configuration Tailwind avec la charte graphique noir/or (`ink`, `panel`, `gold`) reprise de la maquette fournie.
- Polices : Playfair Display (titres serif) + Inter (texte), via `next/font/google`.

## 2. Architecture de communication sécurisée (BFF)
- Le navigateur ne parle **jamais directement** au backend Symfony : toutes les données catalogue sont lues côté serveur (Server Components, réseau Docker interne `http://app:8000`), et toutes les actions authentifiées (login, panier, checkout) passent par des Route Handlers Next.js (`/api/...`) qui jouent le rôle de proxy sécurisé (BFF).
- Le JWT émis par le backend est stocké dans un cookie **httpOnly** (`suffete_token`, `sameSite=lax`), jamais exposé au JavaScript client — protection XSS.
- Conséquence : pas besoin de CORS entre front et back, toute la communication passe par le réseau Docker interne partagé (`lesuffete-network`).

## 3. Design system & layout
- `components/Header.tsx` : bandeau livraison offerte, nav catégories (chargées dynamiquement depuis l’API), logo, compte, panier avec compteur.
- `components/Footer.tsx` : réassurance (livraison/retours/paiement/qualité), colonnes boutique/informations, newsletter, réseaux sociaux, moyens de paiement.
- `components/Logo.tsx` : utilise `public/logo.png` s’il est présent (vérifié via `fs.existsSync` côté serveur), sinon un monogramme SVG doré de secours.

## 4. Pages catalogue
- `/` : hero, grille des 4 collections (Polos, T-Shirts, Sweats & Hoodies, Casquettes), best-sellers.
- `/collection` : tous les produits.
- `/collection/[slug]` : produits filtrés par catégorie (`GET /api/products?category=slug`).
- `/produit/[slug]` : fiche produit avec sélection de taille, gestion du stock (désactive les tailles épuisées, alerte "plus que X en stock"), produits similaires de la même catégorie.

## 5. Compte client
- `/compte/inscription`, `/compte/connexion` : formulaires appelant `/api/auth/register` et `/api/auth/login` (Route Handlers), posent le cookie httpOnly.
- `/compte` : infos utilisateur, historique de commandes (`GET /api/account/orders`, endpoint ajouté côté backend pour l’occasion), déconnexion.

## 6. Panier et commande
- `/panier` : liste des articles, quantité modifiable, suppression, résumé et total, calculés côté backend (jamais recalculés côté front).
- Checkout : `POST /api/checkout` crée la commande et un `PaymentIntent` Stripe côté backend ; redirection vers `/commande/paiement` avec le `clientSecret`.
- `/commande/paiement` : formulaire Stripe Elements (`@stripe/react-stripe-js`), gère aussi le cas où Stripe n’est pas encore configuré côté backend (message clair au lieu d’un crash).
- `/commande/confirmation` : page de remerciement avec numéro de commande.

## 7. Conteneurisation
- `Dockerfile` multi-stage (deps → build Next standalone → runner non-root), build avec `output: 'standalone'`.
- `compose.yaml` du front sur le réseau Docker externe partagé `lesuffete-network`, joignant le backend via `http://app:8000` sans exposer ce dernier au navigateur.
- Testé en live à travers le conteneur : inscription, cookie httpOnly posé, connexion, ajout panier, page panier avec vraies données, checkout (échoue proprement en attendant une vraie clé Stripe côté backend).

## 8. Images produit
- Le type `Product` et les composants `ProductCard` et la fiche produit affichent l’image réelle (`imageUrl`, ajouté côté backend) quand elle est renseignée par l’admin, sinon retombent sur le placeholder dégradé + monogramme.
- Utilisation d’une balise `<img>` classique (pas `next/image`) car les URLs d’images sont saisies librement par l’admin, donc pas de domaine à allowlister à l’avance.

## État actuel
- Catalogue (avec images si renseignées), panier, compte client, carnet d’adresses (API prête, pas encore d’UI dédiée), et tunnel jusqu’au paiement sont fonctionnels de bout en bout contre le vrai backend, en conteneur séparé.
- Logo réel à déposer dans `public/logo.png` (fallback SVG en attendant).
- Clés Stripe de test à renseigner côté backend (`.env.local`) pour tester le paiement jusqu’au bout.
- Pas encore de dépôt git pour ce projet (prévu par l’utilisateur).
