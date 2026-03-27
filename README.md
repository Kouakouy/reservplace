# 🍽️ ReservPlace Backend API

## 📌 Description
ReservPlace est une API backend complète pour la gestion de réservation de tables de restaurants.
Elle est construite avec **Node.js, Express et MongoDB Atlas**, en utilisant une architecture professionnelle combinant :
- **Clean Architecture** (Séparation en 4 couches : Domain, Application, Infrastructure, Interfaces)
- **Domain Driven Design (DDD)** (Entités riches avec logique métier)
- **Architecture Hexagonale / Ports & Adapters** (Interfaces/Ports avec des implémentations de Repositories substituables)

## 🚀 Fonctionnalités
- **Authentification & Autorisation** (JWT avec rôles `ADMIN` et `CLIENT`)
- **Gestion des Restaurants** (Création, recherche, pagination)
- **Gestion des Tables** (Création, gestion de capacité, filtrage des tables disponibles selon une date et une heure)
- **Gestion des Réservations** (Création avec validation stricte anti-conflit de créneaux, annulation, historique, vérification de disponibilité)
- **Documentation Interactive Swagger** intégrée

## 🏗️ Structure du Projet

```text
src/
├── domain/                  # 🧠 Cœur métier pur, indépendant de toute technologie
│   ├── entities/            # Modèles métier riches (User, Restaurant, Table, Reservation)
│   └── repositories/        # Ports (Interfaces) pour les accès aux données
│
├── application/             # ⚙️ Cas d'usage agnostiques
│   └── use-cases/           # Logique applicative (RegisterUser, CreateReservation, etc.)
│
├── infrastructure/          # 🔌 Implémentation technique des adaptateurs
│   ├── auth/                # JwtService
│   ├── config/              # Configuration Swagger
│   ├── database/            # Connexion, modèles Mongoose, et Repositories MongoDB
│
├── interfaces/              # 🌐 Point d'entrée de l'API (Framework Express)
│   ├── controllers/         # Contrôleurs HTTP
│   ├── middlewares/         # Auth, Roles, Erreurs, Pagination
│   └── routes/              # Routes d'API
│
├── app.js                   # Configuration globale Express
└── server.js                # Point de démarrage
```

## 🛠️ Installation et Démarrage

1. **Cloner le projet ou naviguer dans le dossier**
```bash
cd c:\projects\reservplace
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Créer ou modifier le fichier `.env` à la racine (voir `.env.example`) :
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
```

4. **Démarrer le serveur**
```bash
npm run dev     # Mode développement (avec nodemon)
# OU
npm start       # Mode production
```

## 📄 Documentation de l'API (Swagger)
Une fois le serveur démarré, la documentation interactive Swagger est accessible à l'adresse :
👉 **http://localhost:5000/api-docs**

Vous pourrez y tester tous les endpoints directement depuis votre navigateur. Pensez à utiliser la route `/api/auth/login` ou `/api/auth/register` en premier pour obtenir un token **Bearer**, puis cliquez sur le bouton **Authorize** dans l'interface Swagger.

---
*Ce projet a été architecturé pour être maintenable, testable et hautement évolutif.*
